const uuid = require("uuid/v1");
const util = require("util");
const fs = require("fs");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Notes {
  readNotes() {
    return readFileAsync("db/db.json", "utf8");
  }

  writeNotes(data) {
    return writeFileAsync("db/db.json", JSON.stringify(data));
  }

  getNote() {
    return this.readNotes().then((data) => {
      let addedNotes;
      try {
        addedNotes = [].concat(JSON.parse(data));
      } catch (err) {
        addedNotes = [];
      }

      return addedNotes;
    });
  }

  addNotes(data) {
    let { title, text } = data;
    let newNote = { title, text, id: uuid() };

    return this.getNote()
      .then((note) => [...note, newNote])
      .then((updateNotes) => this.writeNotes(updateNotes))
      .then(() => {
        return newNote;
      });
  }

  deleteNotes(id) {
    return this.getNote()
      .then((notes) => notes.filter((note) => note.id != id))
      .then((filteredNotes) => this.writeNotes(filteredNotes));
  }
}

module.exports = new Notes();
