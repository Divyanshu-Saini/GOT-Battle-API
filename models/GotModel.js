//importing mongoose
const mongoose = require('mongoose');

//initialising mongoose model
const Scheme = mongoose.Schema;
const GotSchema = new Scheme({
    name: String,
    year: Number,
    battle_number: Number,
    attacker_king: String,
    defender_king: String,
    attacker_1: String,
    attacker_2: String,
    attacker_3: String,
    attacker_4: String,
    defender_1: String,
    defender_2: String,
    defender_3: String,
    defender_4: String,
    attacker_outcome: String,
    battle_type: String,
    major_death: Number,
    major_capture: Number,
    attacker_size: Number,
    defender_size: Number,
    attacker_commander: String,
    defender_commander: String,
    summer: Number,
    location: String,
    region: String,
    note: String,
});

//exporting model
module.exports = mongoose.model('GotDoc', GotSchema);