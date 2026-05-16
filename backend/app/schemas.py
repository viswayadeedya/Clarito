import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr


# --- Auth ---

class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# --- Workspaces ---

class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceUpdate(BaseModel):
    name: str


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    user_id: uuid.UUID
    created_at: datetime


# --- Chapters ---

class ChapterCreate(BaseModel):
    title: str
    canvas_data: dict[str, Any] = {}
    workspace_id: uuid.UUID | None = None


class ChapterUpdate(BaseModel):
    canvas_data: dict[str, Any]


class ChapterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    canvas_data: dict[str, Any]
    user_id: uuid.UUID
    workspace_id: uuid.UUID | None
    created_at: datetime
