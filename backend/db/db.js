const mongoos = require('mongoose');
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect('mongodb+srv://deadlock:asrasr123@cluster0.mnhdnpb.mongodb.net/?retryWrites=true&w=majority');
        console.log("Connected!!!");
    } catch (error) {
        // Log an error message if the connection fails
        console.log("Not Connected!!");
    }
};

module.exports = connectDB;