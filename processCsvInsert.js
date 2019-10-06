const path = require('path');
const csv = require("csvtojson/v2");
const mongoose = require('mongoose');
const GotDoc = require('./models/GotModel');

mongoose.connect('mongodb://localhost:27017/PRDXN', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
let csvFilePath = path.resolve('./battles.csv');

function setScheme(docs) {
    let arrayOfDoc = []
    docs.forEach(json => {
        let doc = new GotDoc({
            name: json.name,
            year: parseInt(json.year),
            battle_number: parseInt(json.battle_number),
            attacker_king: json.attacker_king,
            defender_king: json.defender_king,
            attacker_1: json.attacker_1,
            attacker_2: json.attacker_2,
            attacker_3: json.attacker_3,
            attacker_4: json.attacker_4,
            defender_1: json.defender_1,
            defender_2: json.defender_2,
            defender_3: json.defender_3,
            defender_4: json.defender_4,
            attacker_outcome: json.attacker_outcome,
            battle_type: json.battle_type,
            major_death: parseInt(json.major_death),
            major_capture: parseInt(json.major_capture),
            attacker_size: parseInt(json.attacker_size),
            defender_size: parseInt(json.defender_size),
            attacker_commander: json.attacker_commander,
            defender_commander: json.defender_commander,
            summer: parseInt(json.summer),
            location: json.location,
            regin: json.regin,
            note: json.note,
        });
        arrayOfDoc.push(doc);
    })
    return arrayOfDoc;
};

(async function init() {
    process.stdout.write('-----------------------------------Processing-----------------------------------');
    let docs = await csv().fromFile(csvFilePath)
    let arrayOfDoc = await setScheme(docs);
    try {
        for (doc of arrayOfDoc) {
            let document = await doc.save({
                validateBeforeSave: false
            });
            process.stdout.write('Document Id :' + document._id + ' ');
        }
        process.stdout.write('-----------------------------------Process completed!-----------------------------------');
        process.exit(0)
    } catch (err) {
        console.error("Error occured :", err);
        process.exit(1);
    }
})();