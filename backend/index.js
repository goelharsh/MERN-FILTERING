const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDB } = require("./database/db");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const { cloudinaryConnect } = require("./utils/cloudinary");
const fileUpload = require("express-fileupload")
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT;

connectDB();
cloudinaryConnect();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173/",
        credentials: true
    })
);
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
// Use the router modules instead of individual route handlers
app.use("/api/user", userRoutes);
app.use("/api/team", teamRoutes);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
