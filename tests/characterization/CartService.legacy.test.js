const CartService = require('../../original/CartService');

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

describe('Legacy CartService Characterization Tests', () => {
    let cart;

    beforeEach(() => {
        localStorage.getItem.mockReturnValue(null);
        localStorage.setItem.mockClear();
        cart = new CartService();
    });

    test('1. Initializes empty if no storage', () => {
        expect(cart.items).toEqual([]);
    });

    test('2. Loads from localStorage correctly', () => {
        localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1, qty: 2 }]));
        const loadedCart = new CartService();
        expect(loadedCart.items.length).toBe(1);
    });

    test('3. Adds new item correctly', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        expect(cart.items.length).toBe(1);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('4. Increments qty for existing item', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 2 });
        expect(cart.items[0].qty).toBe(3);
    });

    test('5. Removes item by id', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        cart.removeItem(1);
        expect(cart.items.length).toBe(0);
    });

    test('6. Calculates subtotal + base shipping (<5kg)', () => {
        cart.addItem({ id: 1, price: 100, weight: 2, qty: 1 });
        // Subtotal: 100, Shipping: 5
        expect(cart.calculateTotal(null, 0)).toBe(105);
    });

    test('7. Calculates shipping for weight > 5kg', () => {
        cart.addItem({ id: 1, price: 10, weight: 6, qty: 1 });
        // Subtotal: 10, Shipping: 10
        expect(cart.calculateTotal(null, 0)).toBe(20);
    });

    test('8. Calculates shipping for weight > 10kg', () => {
        cart.addItem({ id: 1, price: 10, weight: 12, qty: 1 });
        // Subtotal: 10, Shipping: 20
        expect(cart.calculateTotal(null, 0)).toBe(30);
    });

    test('9. Applies SUMMER promo code (10%)', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        // Subtotal: 100, Discount: 10, Shipping: 5
        expect(cart.calculateTotal('SUMMER', 0)).toBe(95);
    });

    test('10. Applies VIP promo code (25%)', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        // Subtotal: 100, Discount: 25, Shipping: 5
        expect(cart.calculateTotal('VIP', 0)).toBe(80);
    });

    test('11. Applies Loyalty discount (> 5 years) (15%)', () => {
        cart.addItem({ id: 1, price: 100, weight: 1, qty: 1 });
        // Subtotal: 100, Discount: 15, Shipping: 5
        expect(cart.calculateTotal(null, 6)).toBe(90);
    });

    test('12. Combines multiple discounts (Promo + Volume > 1000)', () => {
        cart.addItem({ id: 1, price: 1200, weight: 1, qty: 1 });
        // Subtotal: 1200
        // Volume Discount: 120 (10%)
        // SUMMER Promo: 120 (10%)
        // Total Discount: 240
        // Shipping: 5
        // Final: 1200 - 240 + 5 = 965
        expect(cart.calculateTotal('SUMMER', 0)).toBe(965);
    });
});
