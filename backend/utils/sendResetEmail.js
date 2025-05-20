const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shreyaskar26ai@gmail.com",
    pass: "gxot fbmk jkkx xehu"
  }
});

async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: '"MentalHood" <shreyaskar26ai@gmail.com>', // ✅ MATCHES auth.user
    to: to,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Reset email sent:", info.response);
  } catch (err) {
    console.error("❌ Error sending reset email:", err);
    throw err;
  }
}

module.exports = sendResetEmail;
