const nodemailer = require('nodemailer');


// ==========================================
// GMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }

});


// ==========================================
// VERIFY EMAIL SERVER
// ==========================================

transporter.verify((error, success) => {

    if (error) {

        console.log("EMAIL ERROR:", error);

    } else {

        console.log("EMAIL SERVER READY");

    }

});


// ==========================================
// SEND OTP
// ==========================================

async function SendOtp(email, otp) {

    try {

        const info = await transporter.sendMail({

            from: `"KS AI | Kuldeep Sengar" <${process.env.EMAIL}>`,

            to: email,

            subject: '🔐 KS AI - Your Verification Code',

            html: `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>KS AI Verification</title>

</head>


<body
    style="
        margin:0;
        padding:0;
        background:#080a0f;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
    "
>


<!-- ==========================================
     MAIN CONTAINER
=========================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#080a0f;
        padding:45px 15px;
    "
>

<tr>

<td align="center">


<!-- ==========================================
     EMAIL CARD
=========================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:620px;
        background:#11141b;
        border:1px solid #252936;
        border-radius:22px;
        overflow:hidden;
    "
>


<!-- ==========================================
     HEADER
=========================================== -->

<tr>

<td
    align="center"
    style="
        padding:40px 30px;
        background:
            linear-gradient(
                135deg,
                #4f46e5,
                #7c3aed
            );
    "
>


<!-- LOGO -->

<div
    style="
        width:68px;
        height:68px;
        background:rgba(255,255,255,0.15);
        border:1px solid rgba(255,255,255,0.2);
        border-radius:18px;
        margin:0 auto;
        line-height:68px;
        font-size:34px;
    "
>
    ✨
</div>


<!-- BRAND -->

<h1
    style="
        color:#ffffff;
        margin:18px 0 6px;
        font-size:30px;
        font-weight:700;
        letter-spacing:0.5px;
    "
>
    KS AI
</h1>


<p
    style="
        color:#e0e7ff;
        margin:0;
        font-size:14px;
    "
>
    Your Intelligent AI Assistant
</p>


<!-- MANAGER -->

<p
    style="
        color:#ffffff;
        margin:13px 0 0;
        font-size:13px;
        font-weight:bold;
    "
>
    AI Manager — Kuldeep Sengar
</p>


</td>

</tr>



<!-- ==========================================
     CONTENT
=========================================== -->

<tr>

<td
    style="
        padding:42px 38px;
        color:#ffffff;
    "
>


<!-- TITLE -->

<h2
    style="
        margin:0 0 16px;
        font-size:24px;
        color:#ffffff;
    "
>
    Verify your account 🔐
</h2>


<!-- GREETING -->

<p
    style="
        color:#a1a1aa;
        font-size:15px;
        line-height:1.7;
        margin:0 0 15px;
    "
>
    Hello,
</p>


<!-- DESCRIPTION -->

<p
    style="
        color:#a1a1aa;
        font-size:15px;
        line-height:1.8;
        margin:0 0 15px;
    "
>

    We received a request to verify your
    email address for your
    <strong style="color:#ffffff;">
        KS AI
    </strong>
    account.

</p>


<p
    style="
        color:#a1a1aa;
        font-size:15px;
        line-height:1.8;
        margin:0 0 30px;
    "
>

    Please use the verification code below
    to complete your registration and
    activate your account.

</p>



<!-- ==========================================
     OTP BOX
=========================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#191c25;
        border:1px solid #343847;
        border-radius:17px;
        margin:25px 0;
    "
>

<tr>

<td
    align="center"
    style="
        padding:28px 20px;
    "
>


<p
    style="
        margin:0 0 13px;
        color:#71717a;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:3px;
        font-weight:bold;
    "
>
    Verification Code
</p>


<div
    style="
        color:#818cf8;
        font-size:40px;
        font-weight:bold;
        letter-spacing:10px;
        padding-left:10px;
    "
>
    ${otp}
</div>


<p
    style="
        margin:15px 0 0;
        color:#52525b;
        font-size:12px;
    "
>
    Enter this code in your KS AI application
</p>


</td>

</tr>

</table>



<!-- ==========================================
     EXPIRY BOX
=========================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background:#211a09;
        border:1px solid #59440d;
        border-radius:13px;
        margin:25px 0;
    "
>

<tr>

<td
    align="center"
    style="
        padding:16px;
    "
>

<p
    style="
        margin:0;
        color:#fbbf24;
        font-size:14px;
        line-height:1.6;
    "
>

    ⏱️
    <strong>
        This OTP is valid for 5 minutes only.
    </strong>

</p>

</td>

</tr>

</table>



<!-- ==========================================
     SECURITY
=========================================== -->

<h3
    style="
        color:#ffffff;
        font-size:16px;
        margin:30px 0 10px;
    "
>
    🛡️ Security Notice
</h3>


<p
    style="
        color:#71717a;
        font-size:13px;
        line-height:1.8;
        margin:0;
    "
>

    Never share this verification code with
    anyone. The KS AI team will never ask
    you for your OTP, password or other
    confidential information.

</p>


<!-- ==========================================
     WRONG REQUEST
=========================================== -->

<p
    style="
        color:#71717a;
        font-size:13px;
        line-height:1.8;
        margin-top:20px;
    "
>

    If you did not request this verification
    code, you can safely ignore this email.
    Your account will remain secure.

</p>


<!-- ==========================================
     SIGNATURE
=========================================== -->

<div
    style="
        margin-top:35px;
        padding-top:25px;
        border-top:1px solid #252936;
    "
>

<p
    style="
        color:#a1a1aa;
        font-size:14px;
        line-height:1.7;
        margin:0;
    "
>
    Best regards,
</p>


<p
    style="
        color:#ffffff;
        font-size:15px;
        font-weight:bold;
        margin:5px 0 0;
    "
>
    Kuldeep Sengar
</p>


<p
    style="
        color:#6366f1;
        font-size:13px;
        margin:4px 0 0;
    "
>
    AI Manager — KS AI
</p>

</div>


</td>

</tr>



<!-- ==========================================
     FOOTER
=========================================== -->

<tr>

<td
    align="center"
    style="
        padding:28px 25px;
        border-top:1px solid #252936;
        background:#0e1016;
    "
>


<p
    style="
        color:#63636f;
        font-size:12px;
        margin:0;
        line-height:1.6;
    "
>

    © ${new Date().getFullYear()}
    KS AI. All rights reserved.

</p>


<p
    style="
        color:#4f46e5;
        font-size:12px;
        margin:8px 0 0;
        font-weight:bold;
    "
>
    Powered by KS AI
</p>


<p
    style="
        color:#52525b;
        font-size:11px;
        margin:12px 0 0;
    "
>
    AI Manager — Kuldeep Sengar
</p>


</td>

</tr>


</table>


<!-- END CARD -->


</td>

</tr>

</table>


</body>

</html>

            `

        });


        console.log(
            "OTP EMAIL SENT:",
            info.messageId
        );


        return info;


    } catch (error) {

        console.error(
            "OTP EMAIL ERROR:",
            error
        );

        throw error;

    }

}


module.exports = {
    SendOtp
};