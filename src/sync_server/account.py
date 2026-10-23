from dataclasses import dataclass

ADMIN = "admin"
MEMBER = "member"
RELAY = "relay"


@dataclass(frozen=True)
class Account:
    """One person on the team: their number, email, name and role; a relay is the team server's own hosted journal, which sends the writes of whoever signed in to it."""

    id: int
    email: str
    name: str
    role: str

    def is_admin(self) -> bool:
        return self.role == ADMIN

    def is_relay(self) -> bool:
        return self.role == RELAY
