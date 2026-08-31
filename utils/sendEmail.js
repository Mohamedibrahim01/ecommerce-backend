import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
    console.log("Email sent successfully:", data.id);
  } catch (error) {
    console.error("Resend Email Error:", error);
  }
};

export default sendEmail;
