const dataParserForItems = (items) => {
    // Get current timestamp
    let curr = new Date().getTime();
    
    // Get timestamp for one month ago
    let prev = new Date();
    prev.setMonth(prev.getMonth() - 1);
    prev = prev.getTime();

    // Filter items to include only those within the last month
    let newitems = items.filter(item => {
        let itDate = new Date(item.date); // Convert item date to Date object
        return (itDate.getTime() >= prev && itDate.getTime() <= curr); // Check date range
    });

    let parsedData = [];
    let x = 1; // Initialize serial number

    // Function to format date
    function getDate(itemDate) {
        let dater = new Date(Date.parse(itemDate)); // Parse item date
        let txt = dater.toString(); // Convert to string
        return txt.substring(8, 10) + " " + txt.substring(4, 7); // Format date
    }

    let total = 0; // Initialize total amount
    // Iterate over filtered items
    items.forEach((item) => {
        let curr = {
            sno: x, // Serial number
            date: getDate(item.date), // Formatted date
            amount: item.amount, // Item amount
            category: item.category, // Item category
        };
        total += curr.amount; // Add to total
        parsedData.push(curr); // Add to parsed data
        x += 1; // Increment serial number
    });

    // Prepare body as a 2D array
    let body = [];
    for (let data of parsedData) {
        let arr = [];
        for (let key in data) {
            arr.push(data[key]); // Add item values to array
        }
        body.push(arr); // Add array to body
    }

    return { body, total }; // Return parsed body and total amount
}

module.exports = dataParserForItems; // Export function
