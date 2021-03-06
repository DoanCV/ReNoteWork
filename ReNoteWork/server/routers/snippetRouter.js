const router = require("express").Router();
const Snippet = require("../models/snippetModel"); 
const auth = require("../middleware/auth");

// Read clip endpoint
router.get("/", auth, async (req, res) => {

    try {

        const snippets = await Snippet.find({user: req.user});
        res.json(snippets);

    }
    catch(err) {

        // in case of mongoose error
            // empty send for security
        res.status(500).send();

    }

});


// Create clip endpoint
router.post("/", auth, async (req, res) => {

    try {

        // const body = req.body;
        // console.log(body);

        // parse body
        const {title, description, code} = req.body; 
        
        // validate body
        if (!description && !code) {
            return res.status(400).json({ errorMessage: "You need to enter a description or provide code snippet (at least one)." });
        }

        const newSnippet = new Snippet({
            title, description, code, user: req.user
        });
        
        // returns a promise
        const savedSnippet = await newSnippet.save();

        res.json(savedSnippet);

    } 
    catch(err) {

        // in case of mongoose error
            // empty send for security
        res.status(500).send();

    }

});


// Update clip endpoint
router.put("/:id", auth, async (req, res) => {

    try {

        const {title, description, code} = req.body;
        const snippetID = req.params.id;

        // validation
            
        // no description or no code
        if (!description && !code) {
            return res.status(400).json( { errorMessage: "You need to enter a description or provide code snippet (at least one)." } );
        }

        // no snippetID provided
        if (!snippetID){
            return res.status(400).json( { errorMessage: "Contact developer with this query: Missing snippetID." } );
        }

        // if the clip does not exist given a snippetID
        const oldSnippet = await Snippet.findById(snippetID);
        if (!oldSnippet){
            return res.status(400).json( { errorMessage: "Contact developer with this query: Missing clip with given snippetID" } );
        }

        // check if the old clipboard is assoicated with the user trying to update
        if (oldSnippet.user.toString() !== req.user) {
            return res.status(401).json( { errorMessage: "Unauthorized"} );
        }

        oldSnippet.title = title;
        oldSnippet.description = description;
        oldSnippet.code = code;

        const newSnippet = await oldSnippet.save();

        res.json(newSnippet);

    }
    catch(err) {

        // in case of mongoose error
            // empty send for security
        res.status(500).send();

    }

});


// Delete clip endpoint
router.delete("/:id", auth, async (req, res) => {

    try {

        const snippetID = req.params.id;
        // console.log(snippetID);

        // validation for missing ID
        if (!snippetID){
            return res.status(400).json( { errorMessage: "Contact developer with this query: Missing snippetID." } );
        }

        const existingSnippet = await Snippet.findById(snippetID);
        if (!existingSnippet){
            return res.status(400).json( { errorMessage: "Contact developer with this query: Missing clip with given snippetID" } );
        }

        // check if the existing clipboard is assoicated with the user trying to delete
        if (existingSnippet.user.toString() !== req.user) {
            return res.status(401).json( { errorMessage: "Unauthorized"} );
        }

        // await Snippet.findByIdAndDelete();
            // redundant so the line below is faster
        await existingSnippet.delete();

        res.json(existingSnippet);

    }
    catch(err){

        // in case of mongoose error
            // empty send for security
        res.status(500).send();

    }

});


/*
// Test endpoint
router.get("/test", (req, res) => {
    res.send("Router test");
});
*/


module.exports = router;