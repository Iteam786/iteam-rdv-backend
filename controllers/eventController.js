import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail, sendUpdateEmail, sendCancellationEmail } from '../services/emailService.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getEvents = async (req, res) => {
  const { adminType } = req.query;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('admin_type', adminType);

  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
};

export const createEvent = async (req, res) => {
  const event = req.body;

  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Email confirmation
  await sendConfirmationEmail(data);

  res.status(201).json(data);
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  const { data, error } = await supabase
    .from('events')
    .update(updatedEvent)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Email modification
  await sendUpdateEmail(data);

  res.status(200).json(data);
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Email suppression
  await sendCancellationEmail(data);

  res.status(200).json({ message: 'Événement supprimé' });
};
