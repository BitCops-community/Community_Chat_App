const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smpt.hostinger.com",
  port: 465,
secure: true, // use SSL
  auth: {
    user: process.env.NODEMAILER_USER!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
async function main(receiverEmail: string, verificationLink: string) {
  console.log(`Sending Verification Email : ${receiverEmail}`);
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
    from: '"Bitcops Community" <no-reply@bitcops.community.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: "Please Verify Your Email Address", // Subject line
    text: `Please click the following link to verify your email address: ${verificationLink}`, // plain text body
    html: htmlContent, // html body
  });
  
  console.log("Message sent: %s", info.messageId);
}

export { main as SendMail };
