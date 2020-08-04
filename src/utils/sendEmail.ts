import mailer from '@sendgrid/mail';
mailer.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function sendEmail(to: string, subject: string, html: string) {
    const message = {
        from: 'noreply@pebblo.org',
        to,
        subject,
        html
    }

    await mailer.send(message);

    console.log('Email has been sent.');
}