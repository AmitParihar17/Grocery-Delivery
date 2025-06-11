import express from "express"
import { address, getAddress } from "../controllers/addressController.js"
import authUser from "../middleware/authUser.js"

const addressRouter = express.Router()

addressRouter.post("/add",authUser,address)
addressRouter.get("/get",authUser,getAddress)

export default addressRouter