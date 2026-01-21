const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing SMTP connection...');

    // Try port 587 with STARTTLS
    const transporter = nodemailer.createTransport({
        host: 'notify.lumicloud.my.id',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: 'notify@lumicloud.my.id',
            pass: 'Elsafira2512'
        },
        tls: {
            rejectUnauthorized: false // Temporary: ignore certificate errors
        },
        debug: true,
        logger: true
    });

    try {
        console.log('Verifying connection on port 587...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!');

        console.log('\nSending test email...');
        const info = await transporter.sendMail({
            from: '"LumiCloud Test" <notify@lumicloud.my.id>',
            to: 'notify@lumicloud.my.id',
            subject: 'Test Email - LumiCloud',
            text: 'This is a test email',
            html: '<b>This is a test email</b>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code) console.error('Error code:', error.code);
        if (error.response) console.error('Server response:', error.response);
    }
}

testEmail();
