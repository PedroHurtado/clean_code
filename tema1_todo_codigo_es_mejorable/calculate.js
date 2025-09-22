function processOrder(order) {
    const subtotal = calculateSubtotal(order);
    const discountedSubtotal = applyCustomerDiscount(subtotal, order.customer);
    return applyBulkDiscount(discountedSubtotal);
}

function calculateSubtotal({items}) {
    return items.reduce((total, item) => {
        const itemPrice = calculateItemPrice(item);
        return total + (itemPrice * item.quantity);
    }, 0);
}

function calculateItemPrice({price, item: {type}}) {  
    if (isBookItem(type)) {
        price = applyBookDiscount(price);
    }
    return price;
}

function applyCustomerDiscount(subtotal, {isPremium}) {
    return isPremium
        ? subtotal * DISCOUNTS.PREMIUM_CUSTOMER
        : subtotal;
}

function applyBulkDiscount(total) {
    return total > BULK_PURCHASE_THRESHOLD
        ? total * DISCOUNTS.BULK_PURCHASE
        : total;
}

function isBookItem(type) {
    return type === 'book';
}

function applyBookDiscount(price) {
    return price * DISCOUNTS.BOOK;
}

const DISCOUNTS = {
    BOOK: 0.9,
    PREMIUM_CUSTOMER: 0.95,
    BULK_PURCHASE: 0.98
};

const BULK_PURCHASE_THRESHOLD = 100;