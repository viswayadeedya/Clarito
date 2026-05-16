import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import Chapter, User
from app.schemas import ChapterCreate, ChapterResponse, ChapterUpdate

router = APIRouter(prefix="/chapters", tags=["chapters"])


def _own_or_404(chapter: Chapter | None, user: User) -> Chapter:
    if not chapter or chapter.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found")
    return chapter


@router.post("/", response_model=ChapterResponse, status_code=status.HTTP_201_CREATED)
async def create_chapter(
    body: ChapterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = Chapter(
        title=body.title,
        canvas_data=body.canvas_data,
        user_id=current_user.id,
        workspace_id=body.workspace_id,
    )
    db.add(chapter)
    await db.commit()
    await db.refresh(chapter)
    return chapter


@router.get("/", response_model=list[ChapterResponse])
async def get_chapters(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Chapter)
        .where(Chapter.user_id == current_user.id)
        .order_by(Chapter.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{chapter_id}", response_model=ChapterResponse)
async def get_chapter(
    chapter_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    return _own_or_404(chapter, current_user)


@router.patch("/{chapter_id}/canvas", response_model=ChapterResponse)
async def update_canvas(
    chapter_id: uuid.UUID,
    body: ChapterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    chapter = _own_or_404(chapter, current_user)
    chapter.canvas_data = body.canvas_data
    await db.commit()
    await db.refresh(chapter)
    return chapter


@router.delete("/{chapter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chapter(
    chapter_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    _own_or_404(chapter, current_user)
    await db.delete(chapter)
    await db.commit()
