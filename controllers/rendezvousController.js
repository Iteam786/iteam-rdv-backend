import supabase from "../services/supabaseClient.js";
import { sendMail } from "../services/emailService.js";

export const createRendezvous = async (req, res) => {
  const { prenom, nom, its, raison, horaire, type } = req.body;
  const nomComplet = `${prenom} ${nom}`;

  const { data, error } = await supabase.from("rendezvous").insert([
    {
      nom: nomComplet,
      email: its,
      date: horaire.date,
      heure: horaire.heure,
      service: type,
      raison,
    },
  ]).select();

  if (error) return res.status(500).json({ error });

  await sendMail({
    to: its,
    subject: "Confirmation RDV",
    html: `<p>Bonjour ${nomComplet},<br>Votre RDV pour ${type} est confirmé le ${horaire.date} à ${horaire.heure}.</p>`
  });

  res.status(201).json(data[0]);
};