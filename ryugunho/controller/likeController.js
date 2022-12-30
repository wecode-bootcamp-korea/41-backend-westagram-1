const likeService = require("../service/likeService");

async function createLike(req, res, next) {
    try {
        const { postId } = req.body; 
        const userId = req.userId;
    
        const result = await likeService.createLike(userId, postId);
    
        if (!result) {
            return res.status(401).json({ message: "likeFailed" });
        }
    
        return res.status(201).json({ message: "likeCreated!!!" });
    } catch(err) {
        next(err);
    }
}


module.exports = {
    createLike: createLike
}