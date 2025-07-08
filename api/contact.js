import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'erendlweb@gmail.com',
      pass: 'tyeu cyjs rrca vigk'
    }
  });

  try {
    await transporter.sendMail({
      from: 'erendlweb@gmail.com',
      to: 'erenozdil11@gmail.com',
      subject: 'Website Contact Form Message',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Message:</b> ${message}`
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
} 