import 'dotenv/config';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const admins = [
  {
    username: 'bhai',
    password: await bcrypt.hash(process.env.BHAI_PASSWORD, 10),
    admin_type: 'Bhai Saheb'
  },
  {
    username: 'office',
    password: await bcrypt.hash(process.env.OFFICE_PASSWORD, 10),
    admin_type: 'Office Jamaat'
  }
];

try {
  for (const admin of admins) {
    const { error } = await supabase.from('admins').insert(admin);
    if (error) {
      console.error('Erreur lors de l\'insertion :', error);
    } else {
      console.log(`✅ Admin ${admin.username} ajouté avec succès.`);
    }
  }
} catch (err) {
  console.error('Erreur lors du seed :', err);
}
