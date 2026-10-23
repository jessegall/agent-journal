from dataclasses import dataclass


@dataclass(frozen=True)
class AdminRequest:
    """What an admin's request names: an email to invite, a device to revoke, a person to remove, the journal version to pin the team to, or whether journals must run exactly that version."""

    email: str = ""
    device_id: int = 0
    account_id: int = 0
    version: str = ""
    versions: str = ""
