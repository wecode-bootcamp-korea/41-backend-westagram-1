const hashPasswordHandler = require("../utils/bcrypt");
const userModel = require("../model/userDao");

const jwt = require("jsonwebtoken");

class UserService {
    constructor(user) {
        this.user = user;
    }
    // 회원가입 메서드
    async signUp() {
        const hash = new hashPasswordHandler(this.user.password, null);
        const hashedPassword = await hash.encode();

        const userModelHandler = new userModel();
        const userData = userModelHandler.signUp(this.user, hashedPassword);
        return userData;
    }

    // 로그인 메서드
    async signIn() {
        const userModelHandler = new userModel();
        const userData = await userModelHandler.signIn(this.user.email);

        if (!userData) {
            return res.status(401).json({ message: "Invalid user!!! Maybe create one?"});
        }
        
        const hash = await new hashPasswordHandler(
            this.user.password, 
            userData.password
        );

        const passwordsAreEqual = await hash.decode();

        if (!passwordsAreEqual) {
            return res.status(401).json({ message: "Invalid password!!!"});
        }

        const jwtToken = jwt.sign({ userId: userData.id }, process.env.secretKey);
        return jwtToken;
    }

    static async displayAllPosts(userId) {
        const userModelHandler = new userModel();
        const userPostingData = await userModelHandler.displayAllPosts(userId);

        return userPostingData;
    }
}

module.exports = UserService;