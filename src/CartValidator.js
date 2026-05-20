class CartValidator {
    static validateItem(item) {
        if (!item || typeof item !== 'object') throw new Error('Invalid item');
        if (!item.id) throw new Error('Item must have an id');
        if (typeof item.qty !== 'number' || item.qty <= 0) throw new Error('Quantity must be greater than zero');
        if (typeof item.price !== 'number' || item.price < 0) throw new Error('Price cannot be negative');
    }
}
module.exports = CartValidator;
