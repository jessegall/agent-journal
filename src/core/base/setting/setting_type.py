from enum import StrEnum


class SettingType(StrEnum):
    """What kind of value a setting holds."""

    TEXT = "text"
    NUMBER = "number"
    FLAG = "flag"
    CHOICE = "choice"
    LIST = "list"
