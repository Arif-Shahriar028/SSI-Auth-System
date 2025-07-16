import { createTransport, Transporter } from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
}

const mailSender = async (email: string, otp: string): Promise<void> => {
    const transport: Transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.mail as string,
            pass: process.env.pass as string,
        },
    });

    const mailOptions: MailOptions = {
        from: `BRACU`,
        to: email,
        subject: 'BRACU Portal 2FA Code',
        text: `Your email authentication code is ${otp}`,
        html: `<p>Your email authentication code is <strong>${otp}</strong></p>`
    };

    const result = await transport.sendMail(mailOptions);
    return result;
};

export default mailSender;
