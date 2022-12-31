const postService  = require("../service/postService");

async function displayAllPosts(req, res, next) {
    try {
        const userId = req.userId;
        const userPostingData = await postService.displayAllPosts(userId);
    
        res.status(200).json({ data: userPostingData });
    } catch(err) {
        next(err);
    } 

}

async function createPost (req, res, next) {
    try {
        const { title, content, imageUrl } = req.body;

        const userId = req.userId;
    
        const result = await postService.createPost(
            title, content, imageUrl, userId);
    
        if (!result) {
            return res.status(401).json({ message: "post failed to be created!" });
        }
        
        return res.status(201).json({ message: "postCreated!" });
    } catch(err) {
        next(err);
    }

}

async function updatePost(req, res, next) {
    try {
        const { postId } = req.params; 
        const { title, content, imageUrl } = req.body;
    
        const { result, updatedPost } = await postService.updatePost(
            title, content, imageUrl, postId);
        
        if (!result) {
            return res.status(404).json({ message: "updating post failed" });
        }
    
        if (!updatedPost) {
            return res.status(404).json({ message: "showing updatedPost failed" });
        }
    
        return res.status(200).json({ data: updatedPost });
    } catch(err) {
        next(err);
    }
}

async function deletePost(req, res, next) {
    try {
        const { postId } = req.params;
        const result = await postService.deletePost(postId);
    
        if (!result) {
            return res.status(401).json({ message: "failed to delete!!!" });
        }
    
        res.status(201).json({ message: "A post has been deleted"});
    } catch(err) {
        next(err);
    }

}


module.exports = {
    displayAllPosts: displayAllPosts,
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost

}