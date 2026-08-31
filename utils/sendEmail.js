import axios from "axios";

const sendEmail = async (options) => {
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_email: options.email,
      subject: options.subject,
      message: options.message,
    },
  };

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Email sent successfully via EmailJS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "EmailJS Error:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export default sendEmail;
