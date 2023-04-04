import { Amount } from "./Amount";
import { describe, expect, test } from '@jest/globals';

test('create an amount', () => {
	const amount = Amount.create('EUR', 11.12);

	expect(amount.amount).toBe(11.12);
	expect(amount.currency).toBe('EUR');
});


test('add an amount', () => {

	const amount1amount = 11.12;
	const amount2amount = 22.12;

	const amount1 = Amount.create('EUR', amount1amount);
	const amount2 = Amount.create('EUR', amount2amount);

	amount2.add(amount1);

	expect(amount1.amount).toBe(amount1amount);
	expect(amount1.currency).toBe('EUR');
	expect(amount2.amount).toEqual(amount1amount + amount2amount);
	expect(amount2.currency).toBe('EUR');
});

test('deduct an amount', () => {

	const amount1amount = 11.12;
	const amount2amount = 22.12;

	const amount1 = Amount.create('EUR', amount1amount);
	const amount2 = Amount.create('EUR', amount2amount);

	amount2.subtract(amount1);

	expect(amount1.amount).toBe(amount1amount);
	expect(amount1.currency).toBe('EUR');
	expect(amount2.amount).toEqual(amount2amount - amount1amount);
	expect(amount2.currency).toBe('EUR');
});

