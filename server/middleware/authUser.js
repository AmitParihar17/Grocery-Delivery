// import jwt from "jsonwebtoken"
// const authUser = async (req, res, next) => {
//   const { token } = req.cookies;
//   console.log(token);
  

//   if (!token) {
//     return res.json({
//       success: false,
//       message: "Not authorized ",
//     });
//   }
//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
//     if(tokenDecode.id){
//         req.body.userId = tokenDecode.id;
//     } else{
//         return res.json({success : false ,message : "Not autorized"})
//     }
//     next()

//   } catch (error) {
//     console.log(error.message);
//     res.json({
//         success : false,
//         message : error.message,
//     })
//   }
// };

// export default authUser ;

import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("User Token Received:", req.cookies.token);


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized - No token",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode?.id) {
      req.userId = tokenDecode.id;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  } catch (error) {
    console.log("JWT error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};

export default authUser;
