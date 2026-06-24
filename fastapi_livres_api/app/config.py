from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "API Livres - Examen final mobile"
    debug: bool = True
    database_url: str = "mysql+pymysql://books_user:books_password@127.0.0.1:3306/books_api?charset=utf8mb4"
    secret_key: str = "change-me-super-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    cors_origins: str = "*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
