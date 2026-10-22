from dataclasses import dataclass


@dataclass(frozen=True)
class AdminRequest:
    """What an admin's request names: an email to invite, a device to revoke, or a person to remove."""

    email: str = ""
    device_id: int = 0
    account_id: int = 0
