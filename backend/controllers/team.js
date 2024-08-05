const Team = require("../modals/team");

exports.createTeam = async (req,res)=>{
    try {
        const {team_name, team_tagline, users} = req.body;
        if(!team_name || !team_tagline || !users){
            return res.status(404).json({
                message: "Please enter required fields",
                success: false
            });
        }
        const team = await Team.create({team_name, team_tagline, users})
        if(!team){
            return res.status(404).json({
                message: "Unable to create user",
                success: false
            });
        }
        return res.status(200).json({
            message: "Team created successfully",
            success: true,
            data: team
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

exports.getTeamDetails = async(req,res)=>{
    try {
        const {teamId} = req.body;
        if(!teamId){
            return res.status(404).json({
                message: "Please enter required fields",
                success: false
            });
        }
        const fetchTeam = await Team.findById({_id:teamId});
        if(!fetchTeam){
            return res.status(404).json({
                message: "Unable to fetch team",
                success: false
            });
        }
        return res.status(200).json({
            message: "Team fetched successfully",
            success: true,
            data: fetchTeam
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

exports.getAllTeams = async (req,res)=>{
    try {
        const allteams =await Team.find().populate("users");
        if(allteams){
            return res.status(200).json({
                message: "Teams fetched successfully",
                success: true,
                data: allteams
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