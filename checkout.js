function checkout(items) {
<<<<<<< HEAD
    console.log("Starting checkout with discounts...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    // Apply 10% discount
    total = total * 0.9;
=======
    console.log("Starting checkout with tax...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    // Apply 5% tax
    total = total * 1.05;
>>>>>>> feature/tax-v2
    // Fix rounding issue
    return Math.round(total * 100) / 100;
}
module.exports = checkout;
