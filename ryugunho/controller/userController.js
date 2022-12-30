const userService = require("../service/userService");
const hashPasswordHandler = require("../utils/bcrypt");

const jwt = require("jsonwebtoken");

async function signUp(req, res, next) {
    try {
        const user = req.body;
        if (!user) {
            return res.json({ message: "no Data!!!"});
        }
        const userData = userService.signUp(user);
    
        if (!userData) {
            return res.json({ message: "Creating User Failed!!!" });
        } 
        
        else {
            res.status(200).json({ messsage: "userCreated!" });
        }
    } catch(err) {
        next(err);
    }

}

async function signIn(req, res, next) {
    try {
        const user  = req.body;

        const userData = await userService.signIn(user);
        
        if (!userData) {
            return res.status(401).json({ message: "Invalid user!!! Maybe create one?"});
        }
    
        const hash = new hashPasswordHandler(
            user.password, 
            userData.password
        );
    
        const passwordsAreEqual = await hash.decode();
    
        if (!passwordsAreEqual) { 
            return res.status(401).json({ message: "Invalid password!!!"});
        }
    
        const jwtToken = jwt.sign({ userId: userData.id }, process.env.secretKey);
    
        return res.status(200).json({ accessToken: jwtToken });
    } catch(err) {
        next(err);
    }

}

module.exports = {
    signUp: signUp,
    signIn: signIn
}