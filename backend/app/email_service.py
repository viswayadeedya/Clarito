from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.config import settings

_conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    VALIDATE_CERTS=True,
)

_mailer = FastMail(_conf)


async def send_reset_email(to: str, token: str) -> None:
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"
    message = MessageSchema(
        subject="Clarito — Reset your password",
        recipients=[to],
        body=f"""
<p>Hi,</p>
<p>You requested a password reset for your Clarito account.</p>
<p><a href="{reset_url}">Click here to reset your password</a></p>
<p>This link expires in {settings.reset_token_expire_minutes} minutes.</p>
<p>If you didn't request this, you can ignore this email.</p>
""",
        subtype=MessageType.html,
    )
    await _mailer.send_message(message)
