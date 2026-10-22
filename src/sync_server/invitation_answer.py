from dataclasses import dataclass


@dataclass(frozen=True)
class InvitationAnswer:
    """An invitation code for one email, and when it expires."""

    code: str
    email: str
    expires_at: float
