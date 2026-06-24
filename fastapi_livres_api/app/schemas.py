from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100, examples=["Alice Tremblay"])
    email: EmailStr = Field(examples=["alice@example.com"])
    password: str = Field(min_length=6, max_length=100, examples=["secret123"])
    password_confirm: str = Field(min_length=6, max_length=100, examples=["secret123"])

    @model_validator(mode="after")
    def passwords_must_match(self) -> "UserCreate":
        if self.password != self.password_confirm:
            raise ValueError("Les mots de passe ne correspondent pas.")
        return self


class UserLogin(BaseModel):
    email: EmailStr = Field(examples=["alice@example.com"])
    password: str = Field(min_length=1, max_length=100, examples=["secret123"])


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=6, max_length=100)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150, examples=["Le Petit Prince"])
    author: str = Field(min_length=1, max_length=150, examples=["Antoine de Saint-Exupéry"])
    year: int = Field(ge=0, le=2100, examples=[1943])
    status: str = Field(min_length=1, max_length=50, examples=["À lire"])
    comment: str | None = Field(default=None, max_length=1000, examples=["Lecture pour le cours"])


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    author: str | None = Field(default=None, min_length=1, max_length=150)
    year: int | None = Field(default=None, ge=0, le=2100)
    status: str | None = Field(default=None, min_length=1, max_length=50)
    comment: str | None = Field(default=None, max_length=1000)


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    year: int
    status: str
    comment: str | None
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
