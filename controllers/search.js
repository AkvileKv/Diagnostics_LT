const express = require("express");
const router = express.Router() //router function
const _ = require("lodash");
const Nepti = require('../models/nepti');

//-----------PAIESKA---------
router.get("/", function(req, res) {

  let linkClassifier;
  let typedSpecies = _.toLower(req.query.species);
  let defaultClassifier = req.query.classifier;
  let selectedAugaloSeima = req.query.augaloSeima;
  let selectedAugaloGentis = req.query.augaloGentis;
  let selectedPazeistaAugaloDalis = req.query.pazeistaAugaloDalis;
  let selectedMinosMorfologTipas = req.query.minosMorfologTipas;
  let selectedMinosVingiuotumas = req.query.minosVingiuotumas;
  let selectedMinosTakoUzpildymas = req.query.minosTakoUzpildymas;
  let selectedMinosPradzia = req.query.minosPradzia;
  let selectedEkskrementIssidestymas = req.query.ekskrementIssidestymas;
  let selectedEkskrementSpalva = req.query.ekskrementSpalva;
  let selectedViksroSpalva = req.query.viksroSpalva;


  if (defaultClassifier === "Kultūriniai augalai") {
    linkClassifier = "cultivated-plants"
  } else if (defaultClassifier === "Visos rūšys") {
    linkClassifier = "all-species"
  } else {
    console.log("nerasta");
  }
// paieska "all species" sutvarkyti
  if (req.query.species == "") {
    typedSpecies = {
      $ne: null
    };
  }
  if (req.query.augaloSeima == "null") {
    selectedAugaloSeima = {
      $ne: null
    };
  }
  if (req.query.augaloGentis == "null") {
    selectedAugaloGentis = {
      $ne: null
    };
  }
  if (req.query.pazeistaAugaloDalis == "null") {
    selectedPazeistaAugaloDalis = {
      $ne: null
    };
  }
  if (req.query.minosMorfologTipas == "null") {
    selectedMinosMorfologTipas = {
      $ne: null
    };
  }
  if (req.query.minosVingiuotumas == "null") {
    selectedMinosVingiuotumas = {
      $ne: null
    };
  }
  if (req.query.minosTakoUzpildymas == "null") {
    selectedMinosTakoUzpildymas = {
      $ne: null
    };
  }
  if (req.query.minosPradzia == "null") {
    selectedMinosPradzia = {
      $ne: null
    };
  }
  if (req.query.ekskrementIssidestymas == "null") {
    selectedEkskrementIssidestymas = {
      $ne: null
    };
  }
  if (req.query.ekskrementSpalva == "null") {
    selectedEkskrementSpalva = {
      $ne: null
    };
  }
  if (req.query.viksroSpalva == "null") {
    selectedViksroSpalva = {
      $ne: null
    };
  }

if (defaultClassifier === "Visos rūšys"){
  Nepti.find({
    //paieska pritaikyta tik 1 zodziui
    //species laukas DB turi buti perrasytas
    species: typedSpecies,
    augaloSeima: selectedAugaloSeima,
    augaloGentis: selectedAugaloGentis,
    pazeistaAugaloDalis: selectedPazeistaAugaloDalis,
    minosMorfologTipas: selectedMinosMorfologTipas,
    minosVingiuotumas: selectedMinosVingiuotumas,
    minosTakoUzpildymas: selectedMinosTakoUzpildymas,
    minosPradzia: selectedMinosPradzia,
    ekskrementIssidestymas: selectedEkskrementIssidestymas,
    ekskrementSpalva: selectedEkskrementSpalva,
    viksroSpalva: selectedViksroSpalva
  },
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
      console.log("visos rusys");
      console.log(typedSpecies);
      res.render("results", {
        neptis: neptis,
        classifier: _.toUpper(defaultClassifier),
        classifierLink: linkClassifier
      });
    }
  });

} else {
  Nepti.find({
    classifier: defaultClassifier,
      //paieska pritaikyta tik 1 zodziui
      //species laukas DB turi buti perrasytas
    species: typedSpecies,
    augaloSeima: selectedAugaloSeima,
    augaloGentis: selectedAugaloGentis,
    pazeistaAugaloDalis: selectedPazeistaAugaloDalis,
    minosMorfologTipas: selectedMinosMorfologTipas,
    minosVingiuotumas: selectedMinosVingiuotumas,
    minosTakoUzpildymas: selectedMinosTakoUzpildymas,
    minosPradzia: selectedMinosPradzia,
    ekskrementIssidestymas: selectedEkskrementIssidestymas,
    ekskrementSpalva: selectedEkskrementSpalva,
    viksroSpalva: selectedViksroSpalva
  },
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
            console.log("kulturines rusys");
              console.log(typedSpecies);
      res.render("results", {
        neptis: neptis,
        classifier: _.toUpper(defaultClassifier), //uzrasui
        classifierLink: linkClassifier //sugrizti atgal
      });
    }
  });
}

});

module.exports = router;
