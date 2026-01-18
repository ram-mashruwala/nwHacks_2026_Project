from app import db
from sqlalchemy.orm import relationship, Mapped, mapped_column


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(index=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
