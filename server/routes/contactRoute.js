import express, { Router } from "express"
import createContact from "../controllers/contactController.js"
const contactRouter = Router()

contactRouter.post("/contact",createContact)

export {contactRouter}