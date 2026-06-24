from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import get_current_user

router = APIRouter(prefix="/books", tags=["Livres"])


def get_owned_book_or_404(book_id: int, user_id: int, db: Session) -> models.Book:
    book = db.scalar(
        select(models.Book).where(
            models.Book.id == book_id,
            models.Book.owner_id == user_id,
        )
    )
    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livre introuvable.",
        )
    return book


@router.post("", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    payload: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    book = models.Book(
        title=payload.title.strip(),
        author=payload.author.strip(),
        year=payload.year,
        status=payload.status.strip(),
        comment=payload.comment.strip() if payload.comment else None,
        owner_id=current_user.id,
    )

    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.get("", response_model=list[schemas.BookResponse])
def list_books(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    books = db.scalars(
        select(models.Book)
        .where(models.Book.owner_id == current_user.id)
        .order_by(models.Book.created_at.desc())
    ).all()
    return books


@router.get("/{book_id}", response_model=schemas.BookResponse)
def get_book_detail(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return get_owned_book_or_404(book_id, current_user.id, db)


@router.put("/{book_id}", response_model=schemas.BookResponse)
@router.patch("/{book_id}", response_model=schemas.BookResponse)
def update_book(
    book_id: int,
    payload: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    book = get_owned_book_or_404(book_id, current_user.id, db)
    data = payload.model_dump(exclude_unset=True)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aucune donnée à modifier.",
        )

    for field, value in data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(book, field, value)

    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    book = get_owned_book_or_404(book_id, current_user.id, db)
    db.delete(book)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
