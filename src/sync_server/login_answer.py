from dataclasses import dataclass


@dataclass(frozen=True)
class LoginAnswer:
    """What a login gives a machine: its device token, its device number, and the person's account number, name and role."""

    token: str
    device_id: int
    account_id: int
    name: str
    role: str = "member"
