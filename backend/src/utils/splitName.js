function splitFullName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { prenom: '', nom: '' };
  }
  if (parts.length === 1) {
    return { prenom: parts[0], nom: '' };
  }
  return {
    prenom: parts[0],
    nom: parts.slice(1).join(' '),
  };
}

function toParticipant(doc) {
  return {
    id: doc._id.toString(),
    prenom: doc.prenom,
    nom: doc.nom,
    ordre: doc.ordre,
    Organisation: doc.societe,
    motif: doc.motif,
    email: doc.email,
    telephone: doc.tel,
    type: doc.type,
    derige: doc.responsable,
    participation: doc.statut,
    localisation: doc.localisation,
    dateVisite: doc.dateVisite,
    but: doc.but,
    submittedAt: doc.submittedAt,
  };
}

module.exports = { splitFullName, toParticipant };
