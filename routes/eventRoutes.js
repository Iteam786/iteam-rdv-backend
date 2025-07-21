// 📁 routes/eventRoutes.js
import express from "express";
import { supabase } from "../services/supabaseClient.js";
const router = express.Router();

// GET RDVs Bhai
router.get("/bhai", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Bhai Saheb");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET RDVs Office
router.get("/office", async (req, res) => {
  const { data, error } = await supabase
    .from("rendezvous")
    .select("*")
    .eq("type", "Office Jamaat");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST RDV Bhai
router.post("/bhai", async (req, res) => {
  try {
    const { title, start } = req.body;
    const date = start.split("T")[0];
    const heure = start.split("T")[1]?.substring(0, 5);

    const { data, error } = await supabase
      .from("rendezvous")
      .insert([{ nom: title, date, heure, type: "Bhai Saheb", its: "00000000", raison: "Créé par admin" }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur ajout RDV Bhai", error: err.message });
  }
});

// POST RDV Office
router.post("/office", async (req, res) => {
  try {
    const { title, start } = req.body;
    const date = start.split("T")[0];
    const heure = start.split("T")[1]?.substring(0, 5);

    const { data, error } = await supabase
      .from("rendezvous")
      .insert([{ nom: title, date, heure, type: "Office Jamaat", its: "00000000", raison: "Créé par admin" }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur ajout RDV Office", error: err.message });
  }
});

// PUT RDV Bhai
router.put("/bhai/:id", async (req, res) => {
  const { date, heure } = req.body;
  const { id } = req.params;

  const { error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PUT RDV Office
router.put("/office/:id", async (req, res) => {
  const { date, heure } = req.body;
  const { id } = req.params;

  const { error } = await supabase
    .from("rendezvous")
    .update({ date, heure })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// DELETE RDV Bhai
router.delete("/bhai/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("rendezvous").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// DELETE RDV Office
router.delete("/office/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("rendezvous").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
