import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail } from '../services/emailService.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const createRendezvous = async (req, res) => {
  const { type, prenom, nom, its, raison, horaire } = req.body;

  const start = new Date(horaire);
  const end = new Date(start.getTime() + 30 * 60000); // 30 minutes

  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: `${prenom} ${nom} (${its})`,
      start,
      end,
      admin_type: type,
      its,
      raison,
      email: req.body.email // doit être dans form.js aussi
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  await sendConfirmationEmail(data);

  res.status(201).json({ message: 'Rendez-vous enregistré', event: data });
};
