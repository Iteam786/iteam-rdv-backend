import supabase from "../services/supabaseClient.js";
import { sendMail } from "../services/emailService.js";

export const getEvents = async (req, res) => {
  const { type } = req.params;
  const { data, error } = await supabase.from("rendezvous").select("*").eq("service", type);
  if (error) return res.status(500).json({ error });
  res.json(data);
};

export const createEvent = async (req, res) => {
  const { title, start, end, admin_type } = req.body;
  const { data, error } = await supabase.from("rendezvous").insert([
    { nom: title, date: start.split("T")[0], heure: start.split("T")[1].slice(0, 5), service: admin_type },
  ]).select();
  if (error) return res.status(500).json({ error });
  res.status(201).json(data[0]);
};

export const updateEvent = async (req, res) => {
  const { type, id } = req.params;
  const { start } = req.body;
  const newDate = start.split("T")[0];
  const newHeure = start.split("T")[1].slice(0, 5);

  const { data, error } = await supabase
    .from("rendezvous")
    .update({ date: newDate, heure: newHeure })
    .eq("id", id)
    .eq("service", type)
    .select();

  if (error) return res.status(500).json({ error });

  await sendMail({
    to: data[0].email,
    subject: "Modification RDV",
    html: `<p>Bonjour ${data[0].nom},<br>Votre RDV a été modifié au ${newDate} à ${newHeure}.</p>`
  });

  res.json(data[0]);
};

export const deleteEvent = async (req, res) => {
  const { type, id } = req.params;
  const { data, error } = await supabase
    .from("rendezvous")
    .delete()
    .eq("id", id)
    .eq("service", type)
    .select();

  if (error) return res.status(500).json({ error });

  await sendMail({
    to: data[0].email,
    subject: "Annulation RDV",
    html: `<p>Bonjour ${data[0].nom},<br>Votre RDV a été annulé.</p>`
  });

  res.json({ success: true });
};