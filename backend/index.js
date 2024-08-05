const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDB } = require("./database/db");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const { cloudinaryConnect } = require("./utils/cloudinary");
const fileUpload = require("express-fileupload");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified

connectDB().then(() => {
    cloudinaryConnect();

    app.use(express.json());
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true
        })
    );
    app.use(
        fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp",
        })
    );

    // Default route
    app.get('/', (req, res) => {
        res.send('Backend server is running');
    });

    // API routes
    app.use("/api/user", userRoutes);
    app.use("/api/team", teamRoutes);

    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}).catch(error => {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit the application with an error code
});
