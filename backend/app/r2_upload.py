import asyncio
import base64
import re

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, status

from app.config import settings


def _r2_client():
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def _upload_sync(file_id: str, data_url: str) -> str:
    match = re.match(r"data:([^;]+);base64,(.+)", data_url, re.DOTALL)
    if not match:
        return data_url

    mime_type, b64_data = match.group(1), match.group(2)
    image_bytes = base64.b64decode(b64_data)
    ext = mime_type.split("/")[-1]
    key = f"images/{file_id}.{ext}"

    try:
        _r2_client().put_object(
            Bucket=settings.r2_bucket_name,
            Key=key,
            Body=image_bytes,
            ContentType=mime_type,
            CacheControl="public, max-age=31536000, immutable",
        )
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image upload failed: {exc}",
        ) from exc

    return f"{settings.r2_public_url.rstrip('/')}/{key}"


def r2_configured() -> bool:
    return bool(settings.r2_access_key_id and settings.r2_public_url)


async def process_canvas_files(files: dict) -> dict:
    """Upload base64 files to R2 and return the same dict with CDN URLs.

    Files that already have an https:// dataURL are left untouched —
    they were uploaded in a previous save and are already on R2.
    If R2 is not configured the dict is returned unchanged so existing
    base64 images continue to work during the migration period.
    """
    if not r2_configured():
        return files

    async def _one(file_id: str, file_data: dict) -> tuple[str, dict]:
        data_url = file_data.get("dataURL", "")
        if data_url.startswith("data:"):
            cdn_url = await asyncio.to_thread(_upload_sync, file_id, data_url)
            return file_id, {**file_data, "dataURL": cdn_url}
        return file_id, file_data

    pairs = await asyncio.gather(*[_one(fid, fd) for fid, fd in files.items()])
    return dict(pairs)
