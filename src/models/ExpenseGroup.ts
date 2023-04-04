import { Amount, AmountComparision } from "./Amount";
import { Expense, ExpenseType } from "./Expense";
import { Person } from "./Person";

export interface ExpenseGroupOwes {
	direction: 'owes' | 'owed';
	amount: Amount,
	from: Person,
	to: Person,
};

export class ExpenseGroup {

	protected balances: ExpenseGroupOwes[][] = [];
	/** store the ids of the people for later reference when building the balances */
//	protected personIndexInBalances: {[key: number]: number } = [];
	protected personIndexInBalances: number[] = [];

	constructor(
		public people: Person[],
		public expenses: Expense[],
	) {}

	public addExpenseToGroup(expense: Expense): void {
		if (!expense.person || !expense.amount) {
			throw new Error('The expense needs a person and an amount!');
		}

		if (!expense.type) {
			expense.type = ExpenseType.Unknown;
		}

		this.expenses.push(expense);
	}

	public getTotalExpenses(): Amount {
		const amount: Amount = Amount.zero('EUR');
		for (let expense of this.expenses) {
			amount.add(expense.amount);
		}

		return amount;
	}

	/**
	 * 
	 * [
	 *   [ 0, 2125, 2100, 0 ],
	 *   [ 625, 0, 2100, 0 ],
	 *   [ 625, 2125, 0, 0 ],
	 *   [ 625, 2125, 2100, 0 ]
	 * ]
	 */  
	public getPaymentsMatrix(expenseGroup: ExpenseGroup): ExpenseGroupOwes[][]
	{
		const balances: ExpenseGroupOwes[][] = Array(expenseGroup.people.length);

		for (let indexBorrows = 0; indexBorrows < expenseGroup.people.length; indexBorrows++) {
			balances[indexBorrows] = Array(expenseGroup.people.length);
			this.personIndexInBalances[indexBorrows] = this.people[indexBorrows].id;
			for (let indexLends = 0; indexLends < expenseGroup.people.length; indexLends++) {
				balances[indexBorrows][indexLends] = {
					direction: 'owes',
					amount: Amount.zero('EUR'),
					from: expenseGroup.people[indexBorrows],
					to: expenseGroup.people[indexLends],
				};
				if (indexBorrows === indexLends) {
					continue;
				}
				balances[indexBorrows][indexLends].amount.add(
					expenseGroup.personPaid(
						expenseGroup.people[indexLends]
					).divide(
						Amount.create('EUR', 4)
					)
				);
			}
		}

		return balances;	
	}

	/**
	 * what does this person owe?
	 * 
	 */
	public getOwes(person: Person): ExpenseGroupOwes[] {
		const matrix = this.getPaymentsMatrix(this);
		const totalExpensePerPerson = this.shareOfExpenses(person);
		const personPaid = this.personPaid(person);

		// todo greater than equal to
		if (personPaid.compare(totalExpensePerPerson) === AmountComparision.GreaterThan) {
			return []; // or reverse the owes
		}

		const index = this.personIndexInBalances.indexOf(person.id);

		return matrix[index];

		// switch (personPaid.compare(totalExpensePerPerson)) {
		// 	case AmountComparision.EqualTo:
		// 		return {direction: 'owed', amount: Amount.zero(totalExpensePerPerson.currency)};

		// 	case AmountComparision.GreaterThan:
		// 		// they get money
		// 		return {direction: 'owed', amount: personPaid.subtract(totalExpensePerPerson)};

		// 	case AmountComparision.LessThan:
		// 		// they must pay money
		// 		return {direction: 'owes', amount: totalExpensePerPerson.subtract(personPaid)};
		// }

		// return {direction: 'owed', amount: Amount.zero(totalExpensePerPerson.currency)};
	}

	public shareOfExpenses(person: Person): Amount {
		const totalExpenses = this.getTotalExpenses();
		return totalExpenses.divide(
			Amount.create(totalExpenses.currency, this.people.length)
		);
	}

	public personPaid(person: Person): Amount {
		const expensesForPerson = this.expenses.filter((expense: Expense) => {
			return person.id === expense.person.id;
		});

		const amount: Amount = Amount.zero('EUR');

		for (let expense of expensesForPerson) {
			amount.add(expense.amount);
		}

		return amount;
	}
}
