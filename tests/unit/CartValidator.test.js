const CartValidator = require('../../src/CartValidator');

describe('CartValidator', () => {
    test('Throws error for negative quantity', () => {
        expect(() => CartValidator.validateItem({ id: 1, price: 10, qty: -5 }))
            .toThrow('Quantity must be greater than zero');
    });

    test('Throws error for missing ID', () => {
        expect(() => CartValidator.validateItem({ price: 10, qty: 1 }))
            .toThrow('Item must have an id');
    });

    test('Passes for valid item', () => {
        expect(() => CartValidator.validateItem({ id: 1, price: 10, weight: 1, qty: 1 }))
            .not.toThrow();
    });
});
