import express from "express";
import supabase from "../services/supabaseClient.js";
import { sendNotificationEmail } from "../utils/mailer.js";

const router = express.Router();

// ✅ POST - créer un rendez-vous
router.post("/", async (req, res) => {
  try {
    const { nom, prenom, its, raison, date, heure, type } = req.body;

    if (!its || !raison) {
      return res.status(400).json({ error: "ITS et raison sont obligatoires." });
    }

    const { data, error } = await supabase
      .from("rendezvous")
      .insert([{ nom, prenom, its, raison, date, heure, type }]);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "Erreur lors de l'ajout du rendez-vous." });
    }

    console.log("✅ RDV enregistré :", data);
    res.status(200).json(data[0]);
  } catch (err) {
    console.error("❌ Erreur serveur:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// ✅ GET - tous les rdvs Bhai
router.get("/bhai", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Bhai Saheb");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ GET - tous les rdvs Office
router.get("/office", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Office Jamaat");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ PUT - mise à jour Bhai
router.put("/bhai/:id", async (req, res) => {
  const { id } = req.params;
  const { date, heure } = req.body;

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id)
    .eq("type", "Bhai Saheb")
    .select();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data[0], "modification");

  res.json(data[0]);
});

// ✅ PUT - mise à jour Office
router.put("/office/:id", async (req, res) => {
  const { id } = req.params;
  const { date, heure } = req.body;

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id)
    .eq("type", "Office Jamaat")
    .select();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data[0], "modification");

  res.json(data[0]);
});

// ✅ DELETE - suppression Bhai
router.delete("/bhai/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("rendezvous")
    .delete()
    .eq("id", id)
    .eq("type", "Bhai Saheb")
    .select();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data[0], "annulation");

  res.json({ message: "Rendez-vous supprimé" });
});

// ✅ DELETE - suppression Office
router.delete("/office/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("rendezvous")
    .delete()
    .eq("id", id)
    .eq("type", "Office Jamaat")
    .select();

  if (error) return res.status(500).json({ error: error.message });

  await sendNotificationEmail(data[0], "annulation");

  res.json({ message: "Rendez-vous supprimé" });
});

export default router;
