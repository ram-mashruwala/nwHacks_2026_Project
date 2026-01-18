from sqlalchemy import ForeignKey
from app import db
from sqlalchemy.orm import relationship, Mapped, mapped_column


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(index=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)

    strategies: Mapped[list["Strategy"]] = relationship(back_populates="user")

class Strategy(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    given_id: Mapped[str] = mapped_column()
    name: Mapped[str] = mapped_column()

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="strategies")

    option_legs: Mapped[list["OptionLeg"]] = relationship(back_populates="strategiess")

class OptionLeg(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    option_type: Mapped[str] = mapped_column()
    position_type: Mapped[str] = mapped_column()
    strike: Mapped[int] = mapped_column()
    premium: Mapped[int] = mapped_column()
    quantity: Mapped[int] = mapped_column()

    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategy.id"))
    strategiess: Mapped["Strategy"] = relationship(back_populates="option_legs")
