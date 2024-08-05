const express = require("express");
const { getHomeData, filteredUsers, deleteUser, updateUser, createUser } = require("../controllers/user");
const router = express.Router();

router.get("/getHomeData", getHomeData);
router.post("/filteredUsers", filteredUsers);
router.post("/deleteUser", deleteUser);
router.post("/updateUser", updateUser);
router.post("/createUser", createUser);

module.exports = router;
