// Seller Login : /api/seller/login

import jwt from "jsonwebtoken"

export const sellerLogin = async (req,res) =>  {
   try {
     const {email ,password} = req.body
     if(email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD ) {
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn : "7d"})

            res.cookie("sellerToken", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
            });

         return res.status(200).json({
             success : true,
             message :"Successfull Login",
         })
     } else {
      return  res.status(400).json({
            success : false,
            message : "Enter valid email or password"
        })
     }
   } catch (error) {
        res.status(401).json({
            success : false,
            message : error.message
        })
   }

}

 // Seller isAuth  : /api/seller/is-auth

 export const isSellerAuth = async(req,res) => {
    try {
        return res.status(200).json({
            success : true,
            message : "Authorized"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(403).json({
          success: false,
          message: " Not Authorized",
        });
    }
 }

 //Seller logout : api/seller/logout

 export const logout = async (req,res) => {
    try {
        res.clearCookie('sellerToken',{
                httpOnly : true,
                secure : process.env.NODE_ENV === "production",
                sameSite : process.env.NODE_ENV === 'production' ? 'none' : "strict"
        })
        return res.status(200).json({
            success : true ,
            message : "Logged Out"
        })
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            success: false,
            message : error.message
        })
    }
 }