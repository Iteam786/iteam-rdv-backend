import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envoie un email personnalisé (confirmation, modification ou annulation)
 * @param {Object} rdv - Données du rendez-vous
 * @param {"confirmation" | "modification" | "annulation"} type - Type de notification
 */
export async function sendNotificationEmail(rdv, type) {
  const { nom, prenom, its, date, heure, raison, type: rdvType } = rdv;

  let subject = "";
  let html = "";

  const fullName = `${prenom} ${nom}`;
  const formattedDate = new Date(date).toLocaleDateString("fr-FR");

  if (type === "confirmation") {
    subject = `✅ Rendez-vous confirmé avec ${rdvType}`;
    html = `
      <p>Salam ${fullName},</p>
      <p>Votre rendez-vous a bien été <b>confirmé</b> pour :</p>
      <ul>
        <li><b>Date :</b> ${formattedDate}</li>
        <li><b>Heure :</b> ${heure}</li>
        <li><b>Raison :</b> ${raison}</li>
        <li><b>Type :</b> ${rdvType}</li>
        <li><b>Numéro ITS :</b> ${its}</li>
      </ul>
      <p>Barakallahoufik,<br>L'équipe Jamaat</p>
    `;
  } else if (type === "modification") {
    subject = `📝 Rendez-vous modifié - ${rdvType}`;
    html = `
      <p>Salam ${fullName},</p>
      <p>Votre rendez-vous a été <b>modifié</b>. Voici les nouvelles informations :</p>
      <ul>
        <li><b>Date :</b> ${formattedDate}</li>
        <li><b>Heure :</b> ${heure}</li>
        <li><b>Raison :</b> ${raison}</li>
        <li><b>Type :</b> ${rdvType}</li>
        <li><b>Numéro ITS :</b> ${its}</li>
      </ul>
    `;
  } else if (type === "annulation") {
    subject = `❌ Rendez-vous annulé - ${rdvType}`;
    html = `
      <p>Salam ${fullName},</p>
      <p>Votre rendez-vous prévu le ${formattedDate} à ${heure} a été <b>annulé</b>.</p>
      <p>Barakallahoufik.</p>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // L'adresse de l'admin, car pas d'email utilisateur
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email "${type}" envoyé avec succès.`);
  } catch (error) {
    console.error("Erreur envoi email:", error);
  }
}
