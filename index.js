
/**
 * We have used node to run our application from the server side, 
 * this is the node js file that we run it through the command line. 
 */


// Sets up Express to serve static files from specified directories 
// for different content types (HTML, JS, CSS, images, and text).
const express = require('express');
const path = require('path');
const app = express();
app.use("/html", express.static("./app/html"));
app.use("/js", express.static("./public/scripts"));
app.use("/css", express.static("./public/styles"));
app.use("/img", express.static("./public/images"));
app.use("/text", express.static("./public/text"));


// Serve the index.html from the "app/html" folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'html', 'index.html'));
});

let port = 8000;
app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});
