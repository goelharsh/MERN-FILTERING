const express = require("express");
const { createTeam,getTeamDetails, getAllTeams } = require("../controllers/team");
const router = express.Router();

router.post("/createTeam", createTeam);
router.post("/getTeamDetails", getTeamDetails);
router.post("/getAllTeams", getAllTeams);

module.exports = router;
