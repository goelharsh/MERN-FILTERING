const User = require("../modals/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.getHomeData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        let query = {};
        if (search) {
            query = {
                $or: [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name: { $regex: search, $options: 'i' } },
                ]
            };
        }

        const allUsers = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);

        if (allUsers.length===0) {
            return res.status(404).json({
                message: "Users not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: allUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
 
// exports.filteredUsers = async (req, res) => {
//     try {
//         const {domain, available, gender} = req.body; 
//         if(!domain && !available && !gender){
//             return res.status(404).json({
//                 message: "Please check domain OR availability OR gender",
//                 success: false
//             });
//         }
//         const filterdUsers = await User.find({
//             domain: domain,
//             available: available,
//             gender: gender
//         })
//         if(!filterdUsers){
//             return res.status(404).json({
//                 message: "No user found with these filters",
//                 success: false
//             });
//         }
//         return res.status(200).json({
//             message: "Users found successfully",
//             success: true,
//             data: filterdUsers
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// }
exports.filteredUsers = async (req, res) => {
    try {
        const { domain, available, gender } = req.body;

        // Create a query object
        const query = {};
        if (domain) query.domain = domain;
        if (available !== undefined) query.available = available;  // Check for undefined to allow false as valid value
        if (gender) query.gender = gender;

        // Check if any filter criteria are provided
        if (Object.keys(query).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one filter criteria: domain, availability, or gender",
                success: false
            });
        }

        // Fetch filtered users
        const filteredUsers = await User.find(query);
        
        // Handle no users found
        if (filteredUsers.length === 0) {
            return res.status(404).json({
                message: "No users found with these filters",
                success: false
            });
        }

        // Respond with the filtered users
        return res.status(200).json({
            message: "Users found successfully",
            success: true,
            data: filteredUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

exports.deleteUser = async (req,res)=>{
    try {
        const userId = req.body;
        if(!userId){
            return res.status(404).json({
                message: "User id not found",
                success: false
            });
        }
        const deleteUser = await User.findByIdAndDelete(userId);
        if(deleteUser){
            return res.status(200).json({
                message: "Users deleted successfully",
                success: true,
                data: deleteUser
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, gender, domain, available } = req.body;

        if (!first_name || !last_name || !email || !gender || !domain || !available) {
            return res.status(404).json({
                message: "Please enter required fields",
                success: false
            });
        }

        const avatar = req.files.avatar;
        const file = await uploadImageToCloudinary(avatar, process.env.FOLDER_NAME);

        const avatarUrl = file.secure_url; // Extract the URL from the response object

        const user = await User.create({
            first_name,
            last_name,
            email,
            gender,
            domain,
            available,
            avatar: avatarUrl // Save only the URL to the database
        });

        if (!user) {
            return res.status(404).json({
                message: "Unable to create user",
                success: false
            });
        }

        return res.status(200).json({
            message: "User created successfully",
            success: true,
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

exports.updateUser = async(req,res)=>{
    try {
        const {first_name, last_name, email, gender, domain, available} = req.body;
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, {first_name:first_name, last_name:last_name, email:email, gender:gender, domain:domain, available:available});
        if(!user){
            return res.status(404).json({
                message: "Unable to create user",
                success: false
            });
        }
        return res.status(200).json({
            message: "Users updated successfully",
            success: true,
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}