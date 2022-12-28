const { appDataSource } = require("../database/database");

class UserDatabase {

    async signUp(user, hashedPassword) {
        const userData = await appDataSource.query(
            `
            INSERT INTO users (
                name,
                email,
                profile_image,
                password
            ) VALUES (?, ?, ?, ?)
            `, [ user.name, user.email, user.profile_image, hashedPassword ]);

        return userData;
    }

    async signIn(email) {
        const [ userData ] = await appDataSource.query(
        `
        SELECT * 
        FROM users
        WHERE email = ?
        `, [ email ]);

    return userData;
    }

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

}


module.exports = UserDatabase;