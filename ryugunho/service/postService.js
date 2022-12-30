const PostModel = require("../models/postDao");

async function displayAllPosts(userId) {
    const userPostingData = await new PostModel().displayAllPosts(userId);

    return userPostingData;
}

async function createPost(title, content, imageUrl, userId) {
    const result = await new PostModel().createPost(
        title, content, imageUrl, userId);

    return result;
}

async function updatePost(title, content, imageUrl, postId) {
    const result = await new PostModel().updatePost(
        title, content, imageUrl, postId);
    const updatedPost = await new PostModel().showUpdatePost(postId);
    
    return { result, updatedPost };
}

async function deletePost(postId) {
    const result = await new PostModel().deletePost(postId);

    return result;
}


module.exports = {
    displayAllPosts: displayAllPosts,
    updatePost: updatePost,
    createPost: createPost,
    deletePost: deletePost
}