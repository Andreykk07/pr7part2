const CartService = require('../../src/CartService');

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

describe('Refactored CartService Unit Tests', () => {
    beforeEach(() => {
        localStorage.getItem.mockClear();
        localStorage.setItem.mockClear();
    });

    test('Handles JSON parse error gracefully', () => {
        localStorage.getItem.mockReturnValue('invalid-json');
        const cart = new CartService();
        expect(cart.items).toEqual([]); // Did not crash
    });

    test('addItem acts as an async operation and saves data', async () => {
        const cart = new CartService();
        await cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        expect(cart.items.length).toBe(1);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('calculateTotal is now async and uses extracted calculators', async () => {
        const cart = new CartService();
        await cart.addItem({ id: 1, price: 100, weight: 2, qty: 1 });
        const total = await cart.calculateTotal('SUMMER', 0);
        expect(total).toBe(95); // 100 - 10 (promo) + 5 (shipping)
    });
});
