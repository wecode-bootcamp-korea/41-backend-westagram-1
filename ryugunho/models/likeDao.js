const appDataSource = require("../database/database");

class likeDatabase {
    
    async createLike(userId, postId) {
        try {
            const result = await appDataSource.query(`
                INSERT INTO likes
                    (user_id, post_id)
                VALUES (?, ?)
            `, [ userId, postId ]);
    
            return result;
        } catch(err) {
            throw new Error("like failed to be created!")
        }
    }
}

module.exports = likeDatabase;