from dataclasses import dataclass


@dataclass(frozen=True)
class Device:
    """One machine a person logged in from: its number, whose it is, its name, and when it was revoked, zero while it is not."""

    id: int
    account_id: int
    name: str
    revoked_at: float

    def is_revoked(self) -> bool:
        return self.revoked_at > 0
