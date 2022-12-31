const hashPasswordHandler = require("../utils/bcrypt");
const userModel = require("../models/userDao");

// 회원가입 메서드
async function signUp(user) {
    const hash = new hashPasswordHandler(user.password, null);
    const hashedPassword = await hash.encode();

    const userModelHandler = new userModel();
    const userData = userModelHandler.signUp(user, hashedPassword);
    return userData;
}

// 로그인 메서드
async function signIn(user) {
    const userModelHandler = new userModel();
    const userData = await userModelHandler.signIn(user.email);
    
    return userData;
}

module.exports = {
    signUp: signUp,
    signIn: signIn
};