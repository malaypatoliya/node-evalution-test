const connection = require('../../config/database');
const CryptoJS = require('crypto-js');

// get all post for perticular user function
const getPostsFunc = (req, res) => {
    let success = false;
    const auther_id = req.id;
    console.log(auther_id);
    try {
        // get all post for perticular user
        connection.query(`select * from posts where auther_id="${auther_id}";`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                success = true;
                res.status(200).json({ success: success, Msg: "All post fetched successfully", posts: result });
            } else {
                res.status(400).json({ success: success, errMsg: "No post found" });
            }
        })
    } catch (error) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

// add post in database function 
const addPostFunc = (req, res) => {
    let success = false;
    const { title, body } = req.body;
    const auther_id = req.id;
    try {
        // check if title and body is not empty
        if (!title || !body) {
            res.status(400).json({ success: success, errMsg: "Please fill all the fields" });
        } else {
            // check user is exist or not
            connection.query(`select * from users where id="${auther_id}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    // insert post in database
                    connection.query(`insert into posts(title, body, auther_id) values("${title}", "${body}", "${auther_id}");`, (err) => {
                        if (err) throw err;
                        success = true;
                        res.status(200).json({ success: success, Msg: "Post created successfully" });
                    })
                } else {
                    res.status(400).json({ success: success, errMsg: "User not exists" });
                }
            })
        }
    } catch (error) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

// update post in database function with perticular user
const updatePostFunc = (req, res) => {
    let success = false;
    const { title, body } = req.body;
    const auther_id = req.id;
    let post_id = CryptoJS.AES.decrypt(req.header('post_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try {
        // check if title and body is not empty
        if (!title || !body) {
            res.status(400).json({ success: success, errMsg: "Please fill all the fields" });
        } else if (!post_id) {
            res.status(400).json({ success: success, errMsg: "Post id is required" });
        } else {
            // check user is author of post or not
            connection.query(`select * from posts where id="${post_id}" and auther_id="${auther_id}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    connection.query(`update posts set title="${title}", body="${body}" where id="${post_id}";`, (err) => {
                        if (err) throw err;
                        success = true;
                        res.status(200).json({ success: success, Msg: "Post updated successfully" });
                    })
                } else {
                    res.status(400).json({ success: success, errMsg: "You are not author of this post" });
                }
            })
        }
    } catch (error) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

const deletePostFunc = (req, res) => {
    let success = false;
    const auther_id = req.id;
    const post_id = CryptoJS.AES.decrypt(req.header('post_id'), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try {
        if (!post_id) {
            res.status(400).json({ success: success, errMsg: "Post id is required" });
        } else {
            // check user is author of post or not
            connection.query(`select * from posts where id="${post_id}" and auther_id="${auther_id}";`, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    connection.query(`delete from posts where id="${post_id}";`, (err) => {
                        if (err) throw err;
                        success = true;
                        res.status(200).json({ success: success, Msg: "Post deleted successfully" });
                    })
                } else {
                    res.status(400).json({ success: success, errMsg: "You are not author of this post" });
                }
            })
        }
    } catch (error) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

module.exports = {
    getPostsFunc,
    addPostFunc,
    updatePostFunc,
    deletePostFunc
}