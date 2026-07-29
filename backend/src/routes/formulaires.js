const express = require('express');
const Formulaire = require('../models/Formulaire');
const { STATUTS } = require('../models/Formulaire');
const { authMiddleware } = require('../middleware/auth');
const { splitFullName, toParticipant } = require('../utils/splitName');

const router = express.Router();

router.get('/', authMiddleware, async (_req, res) => {
  try {
    const docs = await Formulaire.find().sort({ ordre: 1, createdAt: -1 });
    res.json(docs.map(toParticipant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      nom,
      societe,
      email,
      tel,
      localisation,
      date,
      type,
      motif,
      responsable,
      but,
    } = req.body;

    if (!nom || !societe || !email || !tel || !localisation || !date || !type || !motif || !responsable || !but) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const { prenom, nom: nomFamille } = splitFullName(nom);
    const count = await Formulaire.countDocuments();

    const doc = await Formulaire.create({
      prenom,
      nom: nomFamille || prenom,
      ordre: count + 1,
      societe: String(societe).trim(),
      email: String(email).trim().toLowerCase(),
      tel: String(tel).trim(),
      localisation: String(localisation).trim(),
      dateVisite: new Date(date),
      type: String(type).trim(),
      motif: String(motif).trim(),
      responsable: String(responsable).trim(),
      but: String(but).trim(),
    });

    res.status(201).json(toParticipant(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { statut } = req.body;
    if (statut && !STATUTS.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const doc = await Formulaire.findByIdAndUpdate(
      req.params.id,
      statut ? { statut } : req.body,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ message: 'Formulaire introuvable' });
    }

    res.json(toParticipant(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Formulaire.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Formulaire introuvable' });
    }
    res.json({ message: 'Formulaire supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
