import { Amount } from "./Amount";
import { Group } from "./Group";
import { Person } from "./Person";

export enum ExpenseType {
	Unknown = 'unknown',
	Groceries = 'groceries',
}

export class Expense {
	public constructor(
		public type: ExpenseType,
		public person: Person,
		public amount: Amount,
	) { }
}
