from dataclasses import dataclass


@dataclass(frozen=True)
class Device:
    """One machine a person logged in from: its number, whose it is, its name, when it was revoked, zero while it is not, and when it last pulled, zero before it has."""

    id: int
    account_id: int
    name: str
    revoked_at: float
    pulled_at: float = 0.0

    def is_revoked(self) -> bool:
        return self.revoked_at > 0
