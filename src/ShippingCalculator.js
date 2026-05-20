const { SHIPPING_RATES } = require('./constants');

class ShippingCalculator {
    /**
     * @param {number} weight 
     * @returns {number}
     */
    static calculate(weight) {
        if (weight > SHIPPING_RATES.TIER_2_MAX_WEIGHT) return SHIPPING_RATES.TIER_3_COST;
        if (weight > SHIPPING_RATES.TIER_1_MAX_WEIGHT) return SHIPPING_RATES.TIER_2_COST;
        return SHIPPING_RATES.TIER_1_COST;
    }
}
module.exports = ShippingCalculator;
