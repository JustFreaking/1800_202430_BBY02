const express = require("express");
const path = require("path");
const functions = require("firebase-functions");

const app = express();

// Serve static files
app.use("/html", express.static(path.join(__dirname, "app", "html")));
app.use("/js", express.static(path.join(__dirname, "public", "scripts")));
app.use("/css", express.static(path.join(__dirname, "public", "styles")));
app.use("/img", express.static(path.join(__dirname, "public", "images")));
app.use("/text", express.static(path.join(__dirname, "public", "text")));

// Serve the index.html from the "app/html" folder
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "app", "html", "index.html"));
});

// Export the app as a Firebase Function
exports.app = functions.https.onRequest(app);
