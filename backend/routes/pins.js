import { Router } from "express";
const router=Router();
import Pin from "../models/Pin.js";


//create a pin
router.post("/",async (req,res)=>{
    const newPin= new Pin(req.body);
    try{
        const savedpin= await newPin.save();
        res.status(200).json(savedpin);
    }catch(err){
        res.status(500).json(err);
    }
});

//get all pins

router.get("/",async(req,res)=>{
    try{
        const pins=await Pin.find();
        res.status(200).json(pins);

    }catch(err){
        res.status(500).json(err);
    }
})

export default router;