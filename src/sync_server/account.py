from dataclasses import dataclass

ADMIN = "admin"
MEMBER = "member"


@dataclass(frozen=True)
class Account:
    """One person on the team: their number, email, name and role."""

    id: int
    email: str
    name: str
    role: str

    def is_admin(self) -> bool:
        return self.role == ADMIN
