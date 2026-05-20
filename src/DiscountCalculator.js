const { DISCOUNT_RATES } = require('./constants');

class DiscountCalculator {
    /**
     * @param {number} subtotal 
     * @param {string|null} promoCode 
     * @param {number} userLoyaltyYears 
     * @returns {number}
     */
    static calculate(subtotal, promoCode, userLoyaltyYears) {
        let discount = 0;

        if (promoCode === 'SUMMER') discount += subtotal * DISCOUNT_RATES.SUMMER;
        else if (promoCode === 'VIP') discount += subtotal * DISCOUNT_RATES.VIP;

        if (userLoyaltyYears > 5) discount += subtotal * DISCOUNT_RATES.LOYALTY;
        if (subtotal > DISCOUNT_RATES.VOLUME_THRESHOLD) discount += subtotal * DISCOUNT_RATES.VOLUME_RATE;

        return discount;
    }
}
module.exports = DiscountCalculator;
