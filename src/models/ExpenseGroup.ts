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
//	protected personIndexInBalances: {[key: number]: number } = []; // this is an object with { number: number }, not what I want
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
	 *  This is the "who owes whom what amount matrix"
	 * [	A 		B 		C 		D
	 *  A [ 0,		2125, 	2100,	0 ], <-- owes, e.g. A owes B 2125, C 2100 and D 0 
	 *  B [ 625,	0,		2100,	0 ],
	 *  C [ 625,	2125,	0,		0 ],
	 *  D [ 625,	2125,	2100,	0 ]
	 * ]	 ^
	 * 		 |
	 * 		loans E.g. A loaned 625 to B, C and D
	 */  
	public getPaymentsMatrix(): ExpenseGroupOwes[][]
	{
		const balances: ExpenseGroupOwes[][] = Array(this.people.length);

		for (let indexBorrows = 0; indexBorrows < this.people.length; indexBorrows++) {
			balances[indexBorrows] = Array(this.people.length);
			this.personIndexInBalances[indexBorrows] = this.people[indexBorrows].id;
			for (let indexLends = 0; indexLends < this.people.length; indexLends++) {
				balances[indexBorrows][indexLends] = {
					direction: 'owes',
					amount: Amount.zero('EUR'),
					from: this.people[indexBorrows],
					to: this.people[indexLends],
				};
				if (indexBorrows === indexLends) {
					continue;
				}
				balances[indexBorrows][indexLends].amount.add(
					this.personPaid(
						this.people[indexLends]
					).divide(
						Amount.create('EUR', this.people.length)
					)
				);
			}
		}

		return balances;	
	}

	getOwesFolded(person: Person): Amount {
		const owes = this.getOwes(person);

		if (owes.length === 0) {
			return Amount.zero('EUR');
		}

		return owes.map((previousValue: ExpenseGroupOwes): Amount => {
			return previousValue.amount;
		}).reduce((previousValue: Amount, currentValue: Amount): Amount => {
			return previousValue.add(currentValue);
		});
	}

	/**
	 * what does this person owe?
	 * 
	 */
	public getOwes(person: Person): ExpenseGroupOwes[] {
		const matrix = this.getPaymentsMatrix();
		const totalExpensePerPerson = this.shareOfExpenses(person);
		const personPaid = this.personPaid(person);

		if (
			personPaid.compare(totalExpensePerPerson) === AmountComparision.GreaterThan
			|| personPaid.compare(totalExpensePerPerson) === AmountComparision.EqualTo
		) {
			return []; // or reverse the owes
		}

		const index = this.personIndexInBalances.indexOf(person.id);

		return matrix[index];
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
