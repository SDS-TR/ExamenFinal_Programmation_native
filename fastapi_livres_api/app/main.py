from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import account, auth, books

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pour un examen, on crée les tables automatiquement.
    # Pour un vrai projet, utiliser Alembic pour gérer les migrations.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    description="API REST pour créer un utilisateur et gérer une liste de livres.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(account.router)
app.include_router(books.router)


@app.get("/", tags=["Accueil"])
def root():
    return {
        "message": "API Livres fonctionnelle",
        "documentation": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["Accueil"])
def health_check():
    return {"status": "ok"}
