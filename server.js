// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONFIRMATION_EMAIL,
    pass: process.env.CONFIRMATION_EMAIL_PASSWORD,
  },
})

app.post('/api/rendezvous', async (req, res) => {
  const {
    type,
    nom,
    prenom,
    its,
    date_naissance,
    email,
    numero,
    date_rdv,
  } = req.body

  if (!its || its.length !== 8) {
    return res.status(400).json({ error: 'Numéro ITS invalide (8 chiffres requis)' })
  }

  const { data, error } = await supabase
    .from('rendezvous')
    .insert([
      {
        type,
        nom,
        prenom,
        its,
        date_naissance,
        email,
        numero,
        date_rdv,
      },
    ])

  if (error) {
    console.error('Erreur Supabase :', error)
    return res.status(500).json({ error: 'Erreur lors de la sauvegarde' })
  }

  const mailOptions = {
    from: `"Mosquée RDV" <${process.env.CONFIRMATION_EMAIL}>`,
    to: email,
    subject: 'Confirmation de votre rendez-vous',
    text: `Salam ${prenom},\n\nVotre rendez-vous (${type}) est bien enregistré pour le ${new Date(date_rdv).toLocaleString()}.\n\nMerci !`,
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Erreur envoi mail :', err)
    } else {
      console.log('Mail envoyé :', info.response)
    }
  })

  return res.status(200).json({ message: 'Rendez-vous enregistré ✅' })
})

app.listen(3000, () => {
  console.log('✅ Serveur en ligne sur http://localhost:3000')
})
