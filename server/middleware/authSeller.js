import jwt from "jsonwebtoken"

 const authSeller = async(req,res,next) => {
    const {sellerToken} = req.cookies;

    if (!sellerToken) {
        return res.status(404).json({
            success : false,
            message : "Seller Token Not Found"
        })
    }
    try {
    const decodedToken = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (decodedToken.email === process.env.SELLER_EMAIL) {
            next()
        } else{
            return res.status(401).json({
                success : false,
                message : "Not authorized"
            })
        }
        
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
 }

 export default authSeller