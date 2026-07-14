function checkout(items) {
    console.log("Starting checkout...");
    let total = items.reduce((sum, item) => sum + item.price, 0);
    return total;
}
module.exports = checkout;
