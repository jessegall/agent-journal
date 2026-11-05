from enum import StrEnum


class SettingType(StrEnum):
    """What type of value a setting holds."""

    TEXT = "text"
    NUMBER = "number"
    FLAG = "flag"
    CHOICE = "choice"
    LIST = "list"
    NUMBER_LIST = "number list"
    ANY = "any"
