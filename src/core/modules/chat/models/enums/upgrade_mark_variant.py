from enum import StrEnum


class UpgradeMarkVariant(StrEnum):
    """What an upgrade mark says: the journal was upgraded from version 4."""

    VERSION_FOUR = "from version 4"
