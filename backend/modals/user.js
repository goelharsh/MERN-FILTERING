const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    email:{
        type: String,
    },
    gender:{
        type: String,
    },
    avatar:{
        type: String,
    },
    domain:{
        type: String,
        enum: ['Sales', 'Finance', 'Marketing', 'IT', 'Management', 'UI Designing', 'Business Development'],
        default: 'Sales'
    },
    available:{
        type: Boolean,
    },
})

module.exports = mongoose.model("user", userSchema)