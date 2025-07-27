const nodemailer = require("nodemailer");

/**
 * Generates a 6-digit numeric OTP.
 * @returns {string} The 6-digit OTP.
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends a verification email to the user.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to include in the email.
 */

const EMAIL_SECURE = process.env.EMAIL_SECURE === "true" || process.env.EMAIL_SECURE === "1";
const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Filloptech" <${process.env.EMAIL_FROM}>`, // Using company name in 'from' field
      to: email,
      subject: "Your Filloptech Email Verification Code",
      html: `
<div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333; background-color: #f7f7f7; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <div style="background-color: #0057ff; color: #ffffff; padding: 20px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Filloptech</h1>
      <p style="margin: 5px 0 0; font-size: 18px;">Account Verification</p>
    </div>
    <div style="padding: 30px 40px; line-height: 1.6;">
      <h2 style="color: #333; margin-top: 0;">Confirm Your Email Address</h2>
      <p>Welcome to FillopTech! To access your account, please use the One-Time Password (OTP) below.</p>
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 42px; font-weight: bold; color: #0057ff; letter-spacing: 4px; margin: 0; padding: 15px; background-color: #f0f5ff; border-radius: 8px; display: inline-block;">
          ${otp}
        </p>
      </div>
      <p>This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
      <p>If you did not request this verification, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="font-style: italic;">Thank you for choosing Filloptech.</p>
    </div>
    <div style="background-color: #f7f7f7; color: #888; padding: 20px 30px; text-align: center; font-size: 12px;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Filloptech. All Rights Reserved.</p>
      <p style="margin: 5px 0 0;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</div>
`
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    // In a real app, you might want to handle this error more gracefully
    throw new Error("Could not send verification email.");
  }
};

module.exports = {
  generateOTP,
  sendVerificationEmail
};
