//Boiler plate for setting up express server
const express = require('express');
const fs = require('fs');
const path = require('path');

//Initializes an instance of express
const app = express();
//Sets up the Port
const PORT = process.env.PORT || 3001;

const notesApp = require('./db/db.json');

//Sets up the middleware for multiple static files. Accounts for multiple data types.
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//GET request routes to retrieve information from the public directory, including the homepage and notes html file.
app.get('api/notes', (req, res) => {
    res.json(notesApp.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//If no file exists, then the app default sends the user back to the homepage.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Function that creates the notes and pushes them into an array to be used as a payload to send back to the server.
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
       path.join(__dirname, './db/db.json'),
       JSON.stringify(notesArray, null, 2) 
    );
    return newNote;
}


app.post('api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notesApp);
    res.json(newNote);
});

//Initializes server on the Port specified above and provides a confirmation message in the console.
app.listen(PORT, () => {
    console.log(`API server is ready on port 'http://localhost:${PORT}.`);
});


