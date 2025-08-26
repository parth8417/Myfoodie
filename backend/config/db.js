import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("DB Connected"));
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Exit with failure
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.