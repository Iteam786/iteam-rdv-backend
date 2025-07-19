const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iteamcalender786@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

function generateEmailHTML({ type, its, prenom, nom, date, lieu, lien = null }) {
  let html = `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:10px;">
      <h2 style="color:#2c3e50;">ITS: ${its}</h2>
      <p>Dear ${prenom} ${nom},</p>
  `;

  if (type === 'confirmation') {
    html += `
      <p>Your appointment has been <strong>confirmed</strong>.</p>
      <p><strong>Location:</strong> ${lieu}</p>
      <p><strong>Date & Time:</strong> ${date}</p>
    `;
  } else if (type === 'modification') {
    html += `
      <p>Your appointment has been <strong>rescheduled</strong>.</p>
      <p><strong>New Date & Time:</strong> ${date}</p>
      <p><strong>Location:</strong> ${lieu}</p>
    `;
  } else if (type === 'suppression') {
    html += `
      <p>Your appointment has been <strong>cancelled</strong>.</p>
      <p>You may <a href="${lien}">book a new appointment here</a>.</p>
    `;
  }

  html += `
      <br><p style="color:#888;font-size:0.9em;">Sent by <strong>Iteam Réunion</strong>.</p>
    </div>
  `;

  return html;
}

async function sendEmail({ to, subject, type, its, prenom, nom, date, lieu, lien }) {
  const mailOptions = {
    from: '"Iteam Réunion" <iteamcalender786@gmail.com>',
    to,
    subject,
    html: generateEmailHTML({ type, its, prenom, nom, date, lieu, lien })
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
}

module.exports = {
  sendEmail
};
