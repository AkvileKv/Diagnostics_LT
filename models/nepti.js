const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const neptiSchema = new Schema({
  classifier: String,
  species : String,
  augaloSeima: [String],
  augaloGentis: [String],
  pazeistaAugaloDalis: [String],
  minosMorfologUzpildymas: [String],
  minosVingSusiraizgymas: [String],
  minosTakoUzpildymas: [String],
  minosPradzia: [String],
  ekskrementIssidestymas: [String],
  ekskrementSpalva: [String],
  viksroSpalva: [String],
  filepath: String
});

const Nepti = mongoose.model("Nepti", neptiSchema);

module.exports = Nepti;
