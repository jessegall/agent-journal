from dataclasses import dataclass


@dataclass(frozen=True)
class AdminRequest:
    """What an admin's request names: an email to invite, a device to revoke, a person to remove, or the journal version to pin the team to."""

    email: str = ""
    device_id: int = 0
    account_id: int = 0
    version: str = ""
