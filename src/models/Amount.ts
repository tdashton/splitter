
export enum AmountComparision {
	LessThan,
	EqualTo,
	GreaterThan,
};

export class Amount {

	constructor(
		public currency: string,
		public amount: number
	) {	}

	public static create(currency: string, amount: number) {
		return new Amount(currency, amount);
	}

	public static zero(currency: string) {
		return new Amount(currency, 0);
	}

	compare (amount: Amount): AmountComparision {
		if (this.amount > amount.amount) {
			return AmountComparision.GreaterThan;
		} else if (this.amount < amount.amount) {
			return AmountComparision.LessThan;
		}

		return AmountComparision.EqualTo;
	}

	add = (amount: Amount): Amount => {
		if (amount.currency !== this.currency) {
			throw new Error('Currency of amounts are different');
		}

		Math.round(this.amount += amount.amount);

		return this;
	}

	subtract = (amount: Amount): Amount => {
		if (amount.currency !== this.currency) {
			throw new Error('Currency of amounts are different');
		}

		Math.round(this.amount -= amount.amount);

		return this;
	}

	divide = (amount: Amount): Amount => {
		if (amount.currency !== this.currency) {
			throw new Error('Currency of amounts are different');
		}

		this.amount = Math.round(this.amount / amount.amount);

		return this;
	}
}
