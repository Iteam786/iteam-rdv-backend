import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getOfficeEvents = async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('admin_type', 'Office Jamaat');

  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
};
