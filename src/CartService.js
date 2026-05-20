const DiscountCalculator = require('./DiscountCalculator');
const ShippingCalculator = require('./ShippingCalculator');
const CartValidator = require('./CartValidator');

class CartService {
    constructor() {
        this.items = [];
        this._loadFromStorage();
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem('cart');
            if (saved) {
                this.items = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to parse cart from storage', error);
            this.items = [];
        }
    }

    /**
     * @param {Object} item 
     * @returns {Promise<void>}
     */
    async addItem(item) {
        CartValidator.validateItem(item);

        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.qty += item.qty;
        } else {
            this.items.push(item);
        }
        await this.save();
    }

    async removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        await this.save();
    }

    /**
     * @param {string|null} promoCode 
     * @param {number} userLoyaltyYears 
     * @returns {Promise<number>}
     */
    async calculateTotal(promoCode, userLoyaltyYears) {
        const { subtotal, weight } = this.items.reduce((acc, item) => {
            acc.subtotal += item.price * item.qty;
            acc.weight += item.weight * item.qty;
            return acc;
        }, { subtotal: 0, weight: 0 });

        const discount = DiscountCalculator.calculate(subtotal, promoCode, userLoyaltyYears);
        const shipping = ShippingCalculator.calculate(weight);

        return subtotal - discount + shipping;
    }

    async save() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem('cart', JSON.stringify(this.items));
                resolve();
            } catch (error) {
                reject(new Error('Storage limit exceeded or unavailable'));
            }
        });
    }
}
module.exports = CartService;
