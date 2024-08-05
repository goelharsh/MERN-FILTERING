const mongoose = require("mongoose");

exports.connectDB = async ()=>{
    const db = mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("DB Connected Successfully"))
    .catch(()=> console.log("Error while connecting with databse!!!"))
}