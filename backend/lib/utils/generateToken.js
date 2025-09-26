import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //convert 15 days to milliseconds
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attcks, cross-site reuest forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })
}