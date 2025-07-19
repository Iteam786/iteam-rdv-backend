import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const login = async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return res.status(401).json({ message: 'Identifiant incorrect.' });
  }

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Mot de passe incorrect.' });
  }

  res.status(200).json({
    message: 'Connexion réussie',
    adminType: data.admin_type
  });
};
