const appDataSource = require("../database/database");

class PostDatabase {
    async displayAllPosts(userId) {
        const userPostingData = await appDataSource.query(
            `
            SELECT 
                u.id AS userId, 
                u.profile_image AS userProfileImage, 
                JSON_ARRAYAGG(
                    JSON_OBJECT("postingId", p.id, "postingImageUrl", p.imageUrl, "postingContent", p.content)
                    ) AS postings
            FROM users u 
            INNER JOIN posts p
            ON u.id = p.user_id
            WHERE u.id = ?
            GROUP BY u.id
            `
            , [ userId ]
        );
  
        return userPostingData;
    }

    async createPost(title, content, imageUrl, userId) {
        const result = await appDataSource.query(`
        INSERT INTO posts
            (
                title,
                content,
                user_id,
                imageUrl
            )
        VALUES (?, ?, ?, ?)
        `, [title, content, userId, imageUrl ]);
        
    return result;
    }

    async updatePost(title, content, imageUrl, postId) {
        const result = await appDataSource.query(`
        UPDATE posts
            SET
                title = ?,
                content = ?,
                imageUrl = ?
            WHERE id = ?
    `
    , [ title, content, imageUrl, postId ]);

    return result;
    }

    async showUpdatePost(postId) {
        try {
            const updatedPost = await appDataSource.query(`
            SELECT
                u.id AS userId, 
                u.name AS userName, 
                p.id AS postingId, 
                p.title AS postingTitle, 
                p.content AS postingContent
            FROM users u
            INNER JOIN posts p
            ON u.id = p.user_id
            WHERE p.id = ?
        `
        , [ postId ]);
    
        return updatedPost;
        } catch(err) {
            throw new Error("database Error")
        }

    }

    async deletePost(postId) {
        try {        
            const result = await appDataSource.query(`
            DELETE FROM posts
            WHERE posts.id = ?
            `, [ postId ]);
    
            return result;
        } catch(err) {
            throw new Error("database Error");
        }

    }
}


module.exports = PostDatabase;