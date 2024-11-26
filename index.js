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
