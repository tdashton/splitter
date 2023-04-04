import { expect } from "@jest/globals";
import { Amount } from "../models/Amount";
import { Expense } from "../models/Expense";
import { ExpenseGroup, ExpenseGroupOwes } from "../models/ExpenseGroup";
import { Group } from "../models/Group";
import { Person } from "../models/Person";

export class ExpenseService {

	protected static instance: ExpenseService;

	protected constructor() { }

	public static getInstance(): ExpenseService {
		if (!ExpenseService.instance) {
			ExpenseService.instance = new ExpenseService();
		}

		return ExpenseService.instance;
	}

	/** 
	 * Get current who owes whom what
	 */
 	quitt(expenseGroup: ExpenseGroup): void {
		const total = Amount.zero('EUR');

		expenseGroup.people.forEach((person: Person, index: number) => {
			const amountPaid = expenseGroup.personPaid(person);
			const personOwes = expenseGroup.getOwes(person);
			let personOwesAmount = Amount.zero('EUR');

			if (personOwes.length !== 0) {
				personOwesAmount = personOwes.map((ego: ExpenseGroupOwes) => {
						console.log(`from: ${ego.from.name} to: ${ego.to.name} amount: ${ego.amount.amount}`)
						return ego.amount;
					}
				).reduce((previousValue: Amount, currentValue: Amount) => {
					console.log(previousValue);
					return previousValue.add(currentValue);
				});
			}
			console.log(`
				Person: ${person.name}
				Paid: ${amountPaid.amount} in ${amountPaid.currency}
				Owes: ${personOwesAmount.amount} in ${amountPaid.currency}
			`);
		});
	}
}
