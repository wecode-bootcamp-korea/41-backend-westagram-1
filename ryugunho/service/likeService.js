const likeModel = require('../models/likeDao');

async function createLike(userId, postId) {
    const result = new likeModel().createLike(userId, postId);
    return result;
 }


module.exports = {
    createLike: createLike
};