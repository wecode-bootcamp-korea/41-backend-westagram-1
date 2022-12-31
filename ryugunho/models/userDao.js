const appDataSource = require("../database/database");

class UserDatabase {
    async signUp(user, hashedPassword) {
        try {
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
        } catch(err) {
            throw new Error("database Error!!!");
        }

    }

    async signIn(email) {
        try {
            const [ userData ] = await appDataSource.query(
                `
                SELECT * 
                FROM users
                WHERE email = ?
                `, [ email ]);
        
            return userData;
        } catch(err) {
            throw new Error("database Error");
        }

    }
}


module.exports = UserDatabase;