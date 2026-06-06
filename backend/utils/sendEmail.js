const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD
  }
})

const sendConfirmationEmail = async (toEmail, { row_number, seat_number, eventName, eventDate, eventTime, eventCity, confirmationId }) => {
  await transporter.sendMail({
    from: '"FlashSeat" <veer.learning1010@gmail.com>',
    to: toEmail,
    subject: `Ticket Confirmation: ${eventName}`,
    html: `<h2>Your ticket is confirmed!</h2>
            <p><strong>Event:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>City:</strong> ${eventCity}</p>
            <p><strong>Row:</strong> ${row_number} · <strong>Seat:</strong> ${seat_number}</p>
            <p><strong>Confirmation ID:</strong> ${confirmationId}</p>
            <br/>
            <p>Enjoy the show!</p>`
  })
}

module.exports = { sendConfirmationEmail }