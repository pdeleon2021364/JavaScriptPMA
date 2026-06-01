import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

// Configurar el transportador de email (aligned with .NET SmtpSettings)
const createTransporter = () => {
  if (!config.smtp.username || !config.smtp.password) {
    console.warn(
      'SMTP credentials not configured. Email functionality will not work.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.enableSsl, // true para 465, false para 587
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
    // Evitar que las peticiones HTTP queden colgadas si SMTP no responde
    connectionTimeout: 10_000, // 10s
    greetingTimeout: 10_000, // 10s
    socketTimeout: 10_000, // 10s
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email, name, verificationToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Verifica tu correo electrónico - Kinal Sports',
      html: `
        <h2>¡Bienvenido a Kinal Sports, ${name}!</h2>
        <p>Por favor, verifica tu correo electrónico para tu cuenta de Kinal Sports haciendo clic en el siguiente enlace:</p>
        <a href='${verificationUrl}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
            Verificar correo
        </a>
        <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
        <p>${verificationUrl}</p>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Si no creaste una cuenta, ignora este correo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Restablece tu contraseña - Kinal Sports',
      html: `
        <h2>Solicitud de restablecimiento de contraseña - Kinal Sports</h2>
        <p>Hola ${name},</p>
        <p>Este mensaje es de Kinal Sports.</p>
        <p>Solicitaste restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
        <a href='${resetUrl}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
            Restablecer contraseña
        </a>
        <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
        <p>${resetUrl}</p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: '¡Bienvenido a Kinal Sports!',
      html: `
        <h2>¡Bienvenido a Kinal Sports, ${name}!</h2>
        <p>Tu cuenta ha sido verificada y activada exitosamente.</p>
        <p>Ahora puedes disfrutar de todas las funciones de nuestra plataforma.</p>
        <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
        <p>¡Gracias por unirte a nosotros!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Tu contraseña ha sido actualizada - Kinal Sports',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #f9fafb;
              padding: 20px;
            }
            .email-wrapper {
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content p {
              margin: 0 0 16px 0;
              font-size: 16px;
              line-height: 1.6;
            }
            .greeting {
              font-weight: 600;
              color: #1f2937;
            }
            .success-box {
              background-color: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 16px;
              margin: 24px 0;
              border-radius: 4px;
              color: #065f46;
            }
            .security-tips {
              background-color: #f0f9ff;
              border-left: 4px solid #0284c7;
              padding: 16px;
              margin: 24px 0;
              border-radius: 4px;
              font-size: 14px;
              color: #0c4a6e;
            }
            .security-tips ul {
              margin: 12px 0;
              padding-left: 20px;
            }
            .security-tips li {
              margin: 8px 0;
            }
            .warning-box {
              background-color: #fee2e2;
              border-left: 4px solid #ef4444;
              padding: 16px;
              margin: 24px 0;
              border-radius: 4px;
              color: #7f1d1d;
              font-size: 14px;
            }
            .footer {
              background-color: #f9fafb;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
            .footer p {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <h1>✅ Contraseña Actualizada</h1>
              </div>
              <div class="content">
                <p class="greeting">¡Hola ${name}!</p>
                <p>Tu contraseña en <strong>Kinal Sports</strong> ha sido <strong>actualizada exitosamente</strong>.</p>

                <div class="success-box">
                  <strong>🎉 ¡Cambio completado!</strong> Tu nueva contraseña está ahora activa y puedes usar la plataforma normalmente.
                </div>

                <div class="security-tips">
                  <strong>🔒 Consejos de Seguridad:</strong>
                  <ul>
                    <li>Guarda tu contraseña en un lugar seguro</li>
                    <li>No compartas tu contraseña con nadie</li>
                    <li>Usa contraseñas únicas para cada servicio</li>
                    <li>Si accedes desde dispositivos públicos, recuerda cerrar sesión</li>
                  </ul>
                </div>

                <div class="warning-box">
                  <strong>⚠️ Si no realizaste este cambio:</strong> Si no solicitaste restablecer tu contraseña, es posible que tu cuenta esté comprometida. Por favor, <strong>contacta a nuestro equipo de soporte inmediatamente</strong>.
                </div>

                <p style="color: #6b7280; font-size: 14px;">Gracias por usar <strong>Kinal Sports</strong>. Si tienes preguntas, contacta a nuestro equipo de soporte.</p>
              </div>
              <div class="footer">
                <p><strong>Kinal Sports</strong></p>
                <p>Este es un email automático. Por favor, no respondere a este mensaje.</p>
                <p>&copy; 2024 Kinal Sports. Todos los derechos reservados.</p>
              </Password Changed Successfully', // More aligned with .NET style
      html: `
        <h2>Password Changed</h2>
        <p>Hello ${name},</p>
        <p>Your password has been successfully updated.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>This is an automated email, please do not reply to this message.</p