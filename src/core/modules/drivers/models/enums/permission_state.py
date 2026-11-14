from enum import StrEnum


class PermissionState(StrEnum):
    """Where a request to do one thing stands: asked, allowed once, used by that one run, or declined."""

    REQUESTED = "requested"
    ALLOWED = "allowed"
    USED = "used"
    DECLINED = "declined"
