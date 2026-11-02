from dataclasses import dataclass


@dataclass(frozen=True)
class UndeclaredSetting:
    """A stored setting row no declaration covers, or one whose value is not of its declared type: its key,
    the module its key belongs to and why it is reported."""

    key: str
    module: str
    reason: str
    environment_id: int | None
    value: str
    is_secret: bool
