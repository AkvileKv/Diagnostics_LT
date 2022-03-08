const express = require("express");
const router = express.Router() //router function
const _ = require("lodash");
const Nepti = require('../models/nepti');

//-----------PAIESKA---------
router.get("/", function(req, res) {

  let linkClassifier;
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
  let typedSpecies = _.toLower(req.query.species);

  if (defaultClassifier === "Cultivated plants") {
    linkClassifier = "cultivated-plants"
  } else if (defaultClassifier === "Forest plants") {
    linkClassifier = "forest-plants"
  } else if (defaultClassifier === "All species") {
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

  Nepti.find({
    classifier: defaultClassifier,
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
      // console.log("Paieskos parametrai - " + " typedSpecies: " + typedSpecies + " defaultRegion: " + defaultRegion +
      //   " and selectedHostPlantFamily: " + selectedHostPlantFamily + " and selectedForewing: " +
      //   selectedForewing + " and selectedTegumen: " + selectedTegumen + " and selectedUncus: " +
      //   selectedUncus + " and selectedGnathos: " + selectedGnathos + " and selectedValva: " +
      //   selectedValva + " and selectedJuxta: " + selectedJuxta + " and selectedTranstilla: " +
      //   selectedTranstilla + " and selectedVinculum: " + selectedVinculum +
      //   " and selectedPhallusWithoutCarinae: " + selectedPhallusWithoutCarinae +
      //   " and selectedPhallusWithCarinae: " + selectedPhallusWithCarinae);
      console.log(linkClassifier);
      res.render("results", {
        neptis: neptis,
        classifier: _.toUpper(defaultClassifier),
        classifierLink: linkClassifier
      });
    }
  });

});

module.exports = router;
