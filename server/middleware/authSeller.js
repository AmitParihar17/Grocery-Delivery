// import jwt from "jsonwebtoken"

//  const authSeller = async(req,res,next) => {
//     const {sellerToken} = req.cookies;
//     console.log("REQ.COOKIE CONTENT:", req.cookies);


//     if (!sellerToken) {
//         return res.status(404).json({
//             success : false,
//             message : "Seller Token Not Found"
//         })
//     }
//     try {
//     const decodedToken = jwt.verify(sellerToken, process.env.JWT_SECRET);
//         if (decodedToken.email === process.env.SELLER_EMAIL) {
//             next()
//         } else{
//             return res.status(401).json({
//                 success : false,
//                 message : "Not authorized"
//             })
//         }
        
//     } catch (error) {
//         res.json({
//             success : false,
//             message : error.message
//         })
//     }
//  }

//  export default authSeller

import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;

  console.log("REQ.COOKIE CONTENT:", req.cookies); //  Debug

  if (!sellerToken) {
    return res.status(401).json({
      success: false,
      message: "Seller token not found",
    });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Invalid seller credentials",
      });
    }

    // Optional: Attach decoded info to request
    req.seller = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authSeller;
