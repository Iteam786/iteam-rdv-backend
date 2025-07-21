import express from "express";
import supabase from "../services/supabaseClient.js";
import { sendNotificationEmail } from "../utils/mailer.js";

const router = express.Router();

// 🔹 GET events (Bhai or Office)
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  const { data, error } = await supabase
    .from("rendezvous")
    .select("id, nom, prenom, date, heure, raison, its, email")
    .eq("type", type);

  if (error) {
    console.error("❌ Erreur récupération événements:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// 🔹 POST new event
router.post("/:type", async (req, res) => {
  const { type } = req.params;
  const { title, start, admin_type } = req.body;

  const [date, heure] = start.split("T");

  const newRdv = {
    nom: title,
    date,
    heure,
    type,
    raison: "Ajout manuel (admin)",
    its: "00000000",
  };

  const { data, error } = await supabase.from("rendezvous").insert([newRdv]).select();

  if (error) {
    console.error("❌ Erreur insertion:", error);
    return res.status(500).json({ error: error.message });
  }

  // Pas d'email ici car pas de mail saisi par l'admin
  res.status(201).json(data[0]);
});

// 🔹 PUT update event (heure/date)
router.put("/:type/:id", async (req, res) => {
  const { id } = req.params;
  const { date, heure } = req.body;

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    console.error("❌ Erreur mise à jour:", error);
    return res.status(500).json({ error: error?.message || "Erreur MAJ" });
  }

  // 🔔 Envoi email modification si email existant
  await sendNotificationEmail(data[0], "modification");

  res.json({ success: true });
});

// 🔹 DELETE event
router.delete("/:type/:id", async (req, res) => {
  const { id } = req.params;

  // Récupérer les infos avant suppression pour envoyer un email
  const { data: beforeDelete } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("rendezvous").delete().eq("id", id);

  if (error) {
    console.error("❌ Erreur suppression:", error);
    return res.status(500).json({ error: error.message });
  }

  if (beforeDelete) {
    await sendNotificationEmail(beforeDelete, "annulation");
  }

  res.json({ success: true });
});

export default router;
