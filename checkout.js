function checkout(items) {
    console.log("Starting checkout with tax...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    // Apply 5% tax
    total = total * 1.05;
    return total;
}
module.exports = checkout;
