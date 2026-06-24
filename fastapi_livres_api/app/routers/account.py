from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import get_current_user, hash_password

router = APIRouter(prefix="/account", tags=["Compte utilisateur"])


@router.get("", response_model=schemas.UserResponse)
def get_account(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=schemas.UserResponse)
@router.patch("", response_model=schemas.UserResponse)
def update_account(
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    data = payload.model_dump(exclude_unset=True)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucune donnée à modifier.",
        )

    if "email" in data and data["email"] is not None:
        new_email = data["email"].lower()
        existing_user = db.scalar(
            select(models.User).where(
                models.User.email == new_email,
                models.User.id != current_user.id,
            )
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ce courriel est déjà utilisé.",
            )
        current_user.email = new_email

    if "name" in data and data["name"] is not None:
        current_user.name = data["name"].strip()

    if "password" in data and data["password"] is not None:
        current_user.hashed_password = hash_password(data["password"])

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
