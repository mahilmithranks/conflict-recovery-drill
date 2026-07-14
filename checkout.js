function checkout(items) {
    console.log("Starting checkout with discounts...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    // Apply 10% discount
    total = total * 0.9;
    return total;
}
module.exports = checkout;
