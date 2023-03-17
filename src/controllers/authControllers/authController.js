const connection = require('../../config/database');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

// register user function
const registerFunc = (req, res) => {
    let success = false;
    const { name, email, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: success, errMsg: "All fields are required" });
        } else if (!regex.test(email)) {
            return res.status(400).json({ success: success, errMsg: "Invalid email format" });
        } else {
            connection.query(`select * from users where email="${email}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    return res.status(400).json({ success: success, errMsg: "User already exists" });
                } else {
                    let encryptedPass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
                    connection.query(`insert into users (name, email, password) values ("${name}", "${email}", "${encryptedPass}");`, (err) => {
                        if (err) throw err;
                        success = true;
                        res.status(200).json({ success: success, Msg: "User registered successfully" })
                    })
                }
            })
        }
    } catch (err) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

// login user function
const loginFunc = (req, res) => {
    let success = false;
    const { email, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: success, errMsg: "All fields are required" });
        } else if (!regex.test(email)) {
            return res.status(400).json({ success: success, errMsg: "Invalid email format" });
        } else {
            connection.query(`select * from users where email="${email}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    let decryptedPass = CryptoJS.AES.decrypt(result[0].password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    if (decryptedPass === password) {
                        const token = jwt.sign({ userId: result[0].id }, process.env.SECRET_KEY, { expiresIn: "12h" });
                        success = true;
                        res.status(200).json({ success: success, Msg: "User logged in successfully", token: token });
                    } else {
                        return res.status(400).json({ success: success, errMsg: "Invalid password.. Please enter correct password" });
                    }
                } else {
                    return res.status(400).json({ success: success, errMsg: "User doesn't exist.. First register the user" });
                }
            })
        }
    } catch (err) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

// update user details function
const updateUserFunc = (req, res) => {
    let success = false;
    const autherId = req.id;
    const { name, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    try {
        if (!name || !password) {
            return res.status(400).json({ success: success, errMsg: "All fields are required" });
        } else {
            connection.query(`select * from users where id="${autherId}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    let encryptedPass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
                    connection.query(`update users set name="${name}", password="${encryptedPass}" where id="${autherId}";`, (err) => {
                        if (err) throw err;
                        success = true;
                        res.status(200).json({ success: success, Msg: "User details updated successfully" })
                    })
                } else {
                    return res.status(400).json({ success: success, errMsg: "User not exists" });
                }
            })
        }
    } catch (error) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

// get user details function
const getUserFunc = (req, res) => {
    let success = false;
    const autherId = req.id;

    try {
        if (!autherId) {
            return res.status(400).json({ success: success, errMsg: "User id is required" });
        } else {
            connection.query(`select id, name, email from users where id="${autherId}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    success = true;
                    res.status(200).json({ success: success, Msg: "User details fetched successfully", userDetails: result[0] });
                } else {
                    return res.status(400).json({ success: success, errMsg: "User doesn't exist" });
                }
            })
        }
    } catch (err) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

module.exports = { loginFunc, registerFunc, getUserFunc, updateUserFunc };