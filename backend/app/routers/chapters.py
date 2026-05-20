import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only

from app.auth import get_current_user
from app.database import get_db
from app.models import Chapter, User
from app.r2_upload import process_canvas_files
from app.schemas import ChapterCreate, ChapterResponse, ChapterSummary, ChapterTitleUpdate, ChapterUpdate

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


@router.get("/", response_model=list[ChapterSummary])
async def get_chapters(
    workspace_id: uuid.UUID | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        select(Chapter)
        .options(load_only(
            Chapter.id, Chapter.title,
            Chapter.user_id, Chapter.workspace_id, Chapter.created_at,
        ))
        .where(Chapter.user_id == current_user.id)
    )
    if workspace_id:
        query = query.where(Chapter.workspace_id == workspace_id)
    result = await db.execute(query.order_by(Chapter.created_at.desc()))
    return result.scalars().all()


@router.get("/{chapter_id}", response_model=ChapterResponse)
async def get_chapter(
    chapter_id: uuid.UUID,
    include_files: bool = Query(default=True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    chapter = _own_or_404(chapter, current_user)
    if not include_files and chapter.canvas_data:
        canvas_data = {k: v for k, v in chapter.canvas_data.items() if k != 'files'}
        return {
            'id': chapter.id, 'title': chapter.title,
            'canvas_data': canvas_data,
            'user_id': chapter.user_id, 'workspace_id': chapter.workspace_id,
            'created_at': chapter.created_at,
        }
    return chapter


@router.patch("/{chapter_id}/title", response_model=ChapterSummary)
async def rename_chapter(
    chapter_id: uuid.UUID,
    body: ChapterTitleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    chapter = _own_or_404(chapter, current_user)
    chapter.title = body.title
    await db.commit()
    await db.refresh(chapter)
    return chapter


@router.patch("/{chapter_id}/canvas", response_model=ChapterResponse)
async def update_canvas(
    chapter_id: uuid.UUID,
    body: ChapterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chapter = await db.get(Chapter, chapter_id)
    chapter = _own_or_404(chapter, current_user)
    canvas = body.canvas_data
    existing_files = (chapter.canvas_data or {}).get("files") or {}
    incoming_files = canvas.get("files") or {}
    # Merge: existing CDN URLs are baseline; incoming files override (new uploads win)
    merged_files = {**existing_files, **incoming_files}
    if merged_files:
        merged_files = await process_canvas_files(merged_files)
    chapter.canvas_data = {**canvas, "files": merged_files}
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
