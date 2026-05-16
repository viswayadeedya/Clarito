import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import User, Workspace
from app.schemas import WorkspaceCreate, WorkspaceResponse, WorkspaceUpdate

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


def _own_or_404(workspace: Workspace | None, user: User) -> Workspace:
    if not workspace or workspace.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return workspace


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    body: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = Workspace(name=body.name, user_id=current_user.id)
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace


@router.get("/", response_model=list[WorkspaceResponse])
async def get_workspaces(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Workspace)
        .where(Workspace.user_id == current_user.id)
        .order_by(Workspace.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = await db.get(Workspace, workspace_id)
    return _own_or_404(workspace, current_user)


@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: uuid.UUID,
    body: WorkspaceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = await db.get(Workspace, workspace_id)
    workspace = _own_or_404(workspace, current_user)
    workspace.name = body.name
    await db.commit()
    await db.refresh(workspace)
    return workspace


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(
    workspace_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workspace = await db.get(Workspace, workspace_id)
    _own_or_404(workspace, current_user)
    await db.delete(workspace)
    await db.commit()
