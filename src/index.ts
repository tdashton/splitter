import { Amount } from "./models/Amount";
import { Expense, ExpenseType } from "./models/Expense";
import { ExpenseGroup } from "./models/ExpenseGroup";
import { Group } from "./models/Group";
import { Person } from "./models/Person";
import { ExpenseService } from "./services/ExpenseService";

const person1 = new Person(1, 'person 1', 12);
const person2 = new Person(2, 'person 2', 13);
const person3 = new Person(3, 'person 3', 14);
const person4 = new Person(4, 'person 4', 14);

const groupedPeople = [person1, person2, person3, person4]
const group = new Group(groupedPeople);
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

console.log(expenseGroup);

console.log(expenseGroup.getTotalExpenses());

// groupedPeople.forEach((person: Person) => {
// 	const owes = expenseGroup.getOwes(person);
// 	console.log(`
// 		Person: ${person.name}
// 		${owes.direction} : ${owes.amount.amount}`);
// });


ExpenseService.getInstance().quitt(expenseGroup);
