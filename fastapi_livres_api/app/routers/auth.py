from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Authentification"])


def build_token_response(user: models.User) -> dict:
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


def authenticate_user(email: str, password: str, db: Session) -> models.User:
    user = db.scalar(select(models.User).where(models.User.email == email.lower()))

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Courriel ou mot de passe invalide.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    existing_user = db.scalar(select(models.User).where(models.User.email == email))

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte existe déjà avec ce courriel.",
        )

    user = models.User(
        name=payload.name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(payload.email, payload.password, db)
    return build_token_response(user)


@router.post("/token", response_model=schemas.TokenResponse)
def login_for_swagger_authorize(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Route compatible avec le bouton Authorize de Swagger.

    Dans le formulaire Swagger, utiliser :
    - username = courriel
    - password = mot de passe
    """
    user = authenticate_user(form_data.username, form_data.password, db)
    return build_token_response(user)
