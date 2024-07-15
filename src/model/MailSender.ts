const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "pakearn.tech@gmail.com",
    pass: "lyafgjryblggxpun",
  },
});

async function main(receiverEmail: string, verificationLink: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
      <h2 style="color: #333333;">Verify Your Email Address</h2>
      <p style="color: #666666;">
        Thank you for signing up to Bitcops Community! Please click the button below to verify your email address and complete your registration.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
      </div>
      <p style="color: #666666;">
        If you did not sign up for this account, you can ignore this email.
      </p>
      <p style="color: #666666;">
        Regards,<br />
        The Bitcops Community Team
      </p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: '"Bitcops Community" <no-reply@bitcopscommunity.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: "Please Verify Your Email Address", // Subject line
    text: `Please click the following link to verify your email address: ${verificationLink}`, // plain text body
    html: htmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

export { main as SendMail };
