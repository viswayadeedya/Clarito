import resend

from app.config import settings


async def send_reset_email(to: str, token: str) -> None:
    resend.api_key = settings.resend_api_key
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"
    resend.Emails.send({
        "from": f"Clarito <{settings.mail_from}>",
        "to": [to],
        "subject": "Clarito — Reset your password",
        "html": f"""
<p>Hi,</p>
<p>You requested a password reset for your Clarito account.</p>
<p><a href="{reset_url}">Click here to reset your password</a></p>
<p>This link expires in {settings.reset_token_expire_minutes} minutes.</p>
<p>If you didn't request this, you can ignore this email.</p>
""",
    })
