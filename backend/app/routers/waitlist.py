from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Waitlist
from app.schemas import WaitlistJoin, WaitlistResponse

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


@router.post("/", response_model=WaitlistResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(
    body: WaitlistJoin,
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Waitlist).where(Waitlist.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already on waitlist")
    entry = Waitlist(email=body.email)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
