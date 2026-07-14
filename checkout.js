function checkout(items) {
    console.log("Starting checkout...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    // Fix rounding issue
    return Math.round(total * 100) / 100;
}
module.exports = checkout;
