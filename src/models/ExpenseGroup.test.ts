import { expect, it } from "@jest/globals";
import { Amount, AmountComparision } from "./Amount";
import { Expense, ExpenseType } from "./Expense";
import { ExpenseGroup } from "./ExpenseGroup";
import { Group } from "./Group";
import { Person } from "./Person";

it('passes a basic test, two people same amount paid, nothing owed', () => {
	const groupOfPeople = [
		new Person(1, 'person 1', 12),
		new Person(2, 'person 2', 12),
	];

	const group = new Group(groupOfPeople);
	const expenses = [
		new Expense(ExpenseType.Groceries, groupOfPeople[0], Amount.create('EUR', 2000)),
		new Expense(ExpenseType.Groceries, groupOfPeople[1], Amount.create('EUR', 2000)),
	];

	const expenseGroup = new ExpenseGroup(group.getPeople(), []);
	expenses.forEach((expense: Expense) => {
		expenseGroup.addExpenseToGroup(expense);
	});

	expect(expenseGroup.getTotalExpenses().compare(Amount.create('EUR', 4000)))
		.toEqual(AmountComparision.EqualTo);

	expect(expenseGroup.getOwes(groupOfPeople[0])[0].amount.compare(Amount.zero('EUR')))
		.toEqual(AmountComparision.EqualTo);

	expect(expenseGroup.getOwes(groupOfPeople[1])[1].amount.compare(Amount.zero('EUR')))
		.toEqual(AmountComparision.EqualTo);
});

it('passes a more advanced test', () => {
	const person1 = new Person(1, 'person 1', 12);
	const person2 = new Person(2, 'person 2', 13);
	const person3 = new Person(3, 'person 3', 14);
	const person4 = new Person(4, 'person 4', 14);

	const groupOfPeople = [person1, person2, person3, person4]
	const group = new Group(groupOfPeople);
	const expenses = [
		new Expense(ExpenseType.Groceries, person1, Amount.create('EUR', 1000)),
		new Expense(ExpenseType.Groceries, person2, Amount.create('EUR', 3000)),
		new Expense(ExpenseType.Groceries, person3, Amount.create('EUR', 4000)),
		new Expense(ExpenseType.Groceries, person1, Amount.create('EUR', 1500)),
		new Expense(ExpenseType.Groceries, person2, Amount.create('EUR', 5500)),
		new Expense(ExpenseType.Groceries, person3, Amount.create('EUR', 4400)),
	];

	const expenseGroup = new ExpenseGroup(group.getPeople(), []);
	expenses.forEach((expense: Expense) => {
		expenseGroup.addExpenseToGroup(expense);
	});

	expect(expenseGroup.getTotalExpenses().compare(Amount.create('EUR', 19400)))
		.toEqual(AmountComparision.EqualTo);

	let owes = expenseGroup.getOwes(groupOfPeople[0])[1];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(2125);

	owes = expenseGroup.getOwes(groupOfPeople[0])[2];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(2100);

	owes = expenseGroup.getOwes(groupOfPeople[0])[3];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(0);

	expect(expenseGroup.getOwes(groupOfPeople[1])).toHaveLength(0);
	// expect(owes.direction).toEqual('owed');
	// expect(owes.amount.amount).toEqual(3650);

	expect(expenseGroup.getOwes(groupOfPeople[2])).toHaveLength(0);
	// expect(owes.direction).toEqual('owed');
	// expect(owes.amount.amount).toEqual(3550);

	owes = expenseGroup.getOwes(groupOfPeople[3])[0];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(625);

	owes = expenseGroup.getOwes(groupOfPeople[3])[1];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(2125);

	owes = expenseGroup.getOwes(groupOfPeople[3])[2];
	expect(owes.direction).toEqual('owes');
	expect(owes.amount.amount).toEqual(2100);
});
