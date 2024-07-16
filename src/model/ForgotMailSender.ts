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

async function main(receiverEmail: string, otp: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
      <h2 style="color: #333333;">Forgot Password OTP</h2>
      <p style="color: #666666;">
        You have requested to reset your password. Please use the OTP below to reset your password.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <p style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">${otp}</p>
      </div>
      <p style="color: #666666;">
        If you did not request this, please ignore this email.
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
    subject: "Your OTP for Password Reset", // Subject line
    text: `You have requested to reset your password. Please use the following OTP to reset your password: ${otp}`, // plain text body
    html: htmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

export { main as ForgotMailSender };
