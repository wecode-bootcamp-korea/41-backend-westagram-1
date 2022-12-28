const userService = require("../service/userService");

const jwt = require("jsonwebtoken");

class UserController {

    async signUp(req, res) {
        const user = req.body;

        const userServiceHandler = new userService(user);
        const userData = userServiceHandler.signUp();

        if (!userData) {
            return res.json({ message: "Creating User Failed!!!" });
        } 
        
        else {
            res.status(200).json({ messsage: "userCreated!" });
        }
    }

    async signIn(req, res) {
        const user  = req.body;

        const userServiceHandler = new userService(user);
        const jwtToken = await userServiceHandler.signIn();
        
        return res.status(200).json({ accessToken: jwtToken });
    }

    async displayAllPosts(req, res) {
        const { userId } = req.params;
        const userPostingData = await userService.displayAllPosts(userId);

        res.status(200).json({ data: userPostingData });
    }
}

module.exports = UserController;