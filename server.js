var express = require("express");
var path = require("path");
const fs = require("fs");
const uuid = require("uuid/v1");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const notes = require("./db/notes");

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", function (req, res) {
  notes.getNote().then((data) => res.json(data));
});

app.post("/api/notes", function (req, res) {
  notes.addNotes(req.body).then((data) => res.json(data));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.delete("/api/notes/:id", function (req, res) {
  notes.deleteNotes(req.params.id).then(() =>
    res.json({
      ok: true,
    })
  );
});

app.listen(PORT, function () {
  console.log(`App listening on PORT http://localhost:${PORT}`);
});
