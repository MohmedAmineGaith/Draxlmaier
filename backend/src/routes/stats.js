const express = require('express');
const Formulaire = require('../models/Formulaire');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (_req, res) => {
  try {
    const formulaires = await Formulaire.find();
    const totalVisites = formulaires.length;
    const enPresence = formulaires.filter((f) => f.statut === 'EN_PRESENCE').length;
    const enLigne = formulaires.filter((f) => f.statut === 'EN_LIGNE').length;
    const enAttente = formulaires.filter((f) => f.statut === 'EN_ATTENTE').length;

    const responsables = new Set(formulaires.map((f) => f.responsable).filter(Boolean));

    res.json({
      totalVisites,
      totalAccompagnants: enPresence,
      totalResponsables: responsables.size,
      totalCommentaires: 0,
      totalVisiteurs: enAttente,
      totalParticipants: enLigne + enPresence,
      enPresence,
      enLigne,
      enAttente,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
