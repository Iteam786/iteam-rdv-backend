// 📁 routes/rendezvousRoutes.js
import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { sendNotificationEmail } from "../utils/mailer.js";

const router = express.Router();

// 📌 Création d’un nouveau rendez-vous
router.post("/", async (req, res) => {
  try {
    const { nom, prenom, its, raison, date, heure, type } = req.body;

    if (!its || !raison) {
      return res.status(400).json({ error: "ITS et raison sont obligatoires." });
    }

    const { data, error } = await supabase
      .from("rendezvous")
      .insert([{ nom, prenom, its, raison, date, heure, type }])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "Erreur lors de l'ajout du rendez-vous." });
    }

    // ✅ Envoyer email de confirmation
    await sendNotificationEmail(data, "confirmation");

    console.log("✅ RDV enregistré :", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Erreur serveur:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 📌 Récupération des RDVs Bhai Saheb
router.get("/bhai", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Bhai Saheb");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 📌 Récupération des RDVs Office Jamaat
router.get("/office", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Office Jamaat");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 📌 Mise à jour RDV Bhai
router.put("/bhai/:id", async (req, res) => {
  const { id } = req.params;
  const { date, heure } = req.body;

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data, "modification");
  res.json(data);
});

// 📌 Mise à jour RDV Office
router.put("/office/:id", async (req, res) => {
  const { id } = req.params;
  const { date, heure } = req.body;

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data, "modification");
  res.json(data);
});

// 📌 Suppression RDV Bhai
router.delete("/bhai/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("rendezvous")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data, "annulation");
  res.json({ success: true });
});

// 📌 Suppression RDV Office
router.delete("/office/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("rendezvous")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data, "annulation");
  res.json({ success: true });
});

export default router;
