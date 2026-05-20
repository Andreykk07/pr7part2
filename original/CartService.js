class CartService {
    constructor() {
        this.items = [];
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.items = JSON.parse(saved); // Problem 5: No try-catch
        }
    }

    addItem(item) {
        // Problem 4: No validation for negative qty or missing fields
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.qty += item.qty;
        } else {
            this.items.push(item);
        }
        this.save(); // Problem 6: Synchronous
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }

    // Problem 1: God Object (does everything)
    calculateTotal(promoCode, userLoyaltyYears) {
        let subtotal = 0;
        let weight = 0;
        
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            subtotal += item.price * item.qty;
            weight += item.weight * item.qty;
        }

        // Problem 2 & 3: Magic numbers and duplicated logic
        let discount = 0;
        if (promoCode === 'SUMMER') {
            discount += subtotal * 0.1;
        } else if (promoCode === 'VIP') {
            discount += subtotal * 0.25;
        }

        if (userLoyaltyYears > 5) {
            discount += subtotal * 0.15; 
        }

        if (subtotal > 1000) {
            discount += subtotal * 0.1;
        }

        let total = subtotal - discount;

        let shipping = 0;
        if (weight > 10) {
            shipping = 20;
        } else if (weight > 5) {
            shipping = 10;
        } else {
            shipping = 5;
        }

        return total + shipping;
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items)); // Problem 5
    }
}
module.exports = CartService;
