import { Person } from "./Person";

export class Group {

	constructor(
		protected people: Person[]
	) {

	}

	addPerson(person: Person) {
		this.people.push(person);
	}

	getPeople(): Person[] {
		return this.people;
	}
}
