import express from 'express'
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'

import Post from '../mongodb/models/post.js'

dotenv.config()

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET all post
router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({})

        res.status(200).json({success: true, data: posts})

    } catch(error) {     
        res.status(500).json({success: false, data: error})
    }
})

// CREATE post
router.route('/').post(async(req, res) => {
 try {
    const {name, prompt, photo} = req.body
    const photoUrl = await cloudinary.uploader.upload(photo)

    const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url
    })


    res.status(201).json({success: true, data: newPost})
 } catch (error) {
    res.status(500).json({success: false, message: error})
 }
})

// DELETE post
// This route is not set up for client you can manage(delete) the data by using softwares like POSTMAN!
router.route('/:id').delete(async(req,res) => {
    try {
        const {id} = req.params

        const deletPost = await Post.findByIdAndDelete(id)

        res.status(200).json({success: true, data: deletPost})
    }catch(error) {
        res.status(404).json({success: false, message: `No such Id was found, the error status is: ${error}`})
    }
})

export default router;