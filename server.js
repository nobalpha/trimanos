const exp = require("constants");
const express = require("express");
const path = require("path");
const app = express();
const port = 3002;

app.use("/", express.static("./scripts"));
// app.use(express.static(path.join(__dirname, "./views")));

app.use((req, res, next) => {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

app.get("/", (req, res) => {
    console.log("hmm");
    //res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    //res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    //res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.sendFile(path.join(__dirname, "./index.html"));
    // return res.render("index");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
