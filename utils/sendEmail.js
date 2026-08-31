import { Resend } from "resend";

const sendEmail = async (options) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent successfully, ID:", data.id);
  } catch (error) {
    console.error("Resend Email Error:", error.message || error);
  }
};

export default sendEmail;
