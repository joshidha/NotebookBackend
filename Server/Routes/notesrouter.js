const express=require('express');
const Notes=require('../Model/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser=require('../Middleware/fetchuser');
const router=express.Router();
// Route 1 : Fetch all notes of a user from Database using Get request
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try{
    const notes=await Notes.find({user:req.user.id});
    res.json(notes);
    }
    catch (error) {
        res.status(500).status("internal server error");
    }
})
// Route 2 : Create a new note using post method, login required
router.post('/addnote',[
    body('title','Enter valid title').isLength({min:5}),
    body('description','Enter valid Description').isLength({min:5})
],fetchuser,async(req,res)=>{
    try {
            const {title,description,tag}=req.body;
            const errors = validationResult(req);
                if (!errors.isEmpty()) 
                {
                    return res.status(400).json({ errors: errors.array() });
                }
            
                const note=new Notes({
                    title,description,tag,user:req.user.id
                })
                const saveNote=await note.save();
                res.json(saveNote);
    } catch (error) {
        res.status(500).status("internal server error");
    }
})

// Route 3 : Update an existing note using Put "/api/note/updatenote - login required"
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    try {
        const {title,description,tag}=req.body;
        // create a new note
        const newnote={};
        if(title)
        {
            newnote.title=title;
        }
        if(description)
        {
            newnote.description=description;
        }
        if(tag)
        {
            newnote.tag=tag;
        }

        // Checking if the note exist to be updated
        let note=await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("Not found");
        }

        // checking if authorized user is accessing the note
        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("You are unauthorized to view the item");
        }

        // find the note to be updated and update it
        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true});
        res.json({note});
    }
    catch (error) {
        res.status(500).status("internal server error");
    }
        
})

// delete a note from database for a user using delete : /api/note/deletenote/:id - user must be logged in
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        // Checking if the note exist to be updated
        let note=await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("Not found");
        }

        // checking if authorized user is accessing the note
        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("Unauthorized request");
        }
        note=await Notes.findByIdAndDelete(req.params.id);
        res.status(200).send("data deleted successfully");
    }
    catch (error) {
        res.status(500).status("internal server error");
    }
})
module.exports=router;