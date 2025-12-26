import { Contact } from "../models/contact.model.js"

const createContact = async(req,res) => {
    try {
        const {name,email,message} = req.body
        if ([name,email,message].some(field => !field?.trim())) {
            return res.status(400).json({
                status : false,
                message : "All fields are required"
            })
        }
        await Contact.create({
            name,
            email,
            message
        })

        return res.status(200).json({
            success : true,
            message : "Message sent successfully"
        })
    } catch (error) {
        console.log(error.message,"error while sending message");
        
          return res.status(500).json({
            status: false,
            message: "Server error failed to send message",
          });
    }
}

export default createContact