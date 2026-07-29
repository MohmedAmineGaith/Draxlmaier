const mongoose = require('mongoose');

const STATUTS = ['EN_PRESENCE', 'EN_LIGNE', 'EN_ATTENTE'];

const formulaireSchema = new mongoose.Schema(
  {
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    ordre: { type: Number, required: true },
    societe: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    tel: { type: String, required: true, trim: true },
    localisation: { type: String, required: true, trim: true },
    dateVisite: { type: Date, required: true },
    type: { type: String, required: true, trim: true },
    motif: { type: String, required: true, trim: true },
    responsable: { type: String, required: true, trim: true },
    but: { type: String, required: true, trim: true },
    statut: { type: String, enum: STATUTS, default: 'EN_ATTENTE' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Formulaire', formulaireSchema);
module.exports.STATUTS = STATUTS;
