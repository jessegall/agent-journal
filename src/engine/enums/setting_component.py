from enum import StrEnum

from engine.enums.setting_type import SettingType


class SettingComponent(StrEnum):
    """The piece of a settings screen that draws one setting, each able to draw some kinds of setting."""

    TOGGLE = "toggle"
    NUMBER = "number"
    CHOICE = "choice"
    ENTRY_LIST = "entry-list"
    NUMBER_LIST = "number-list"
    TEXT = "text"
    KEYED_CAP_TABLE = "keyed-cap-table"
    THREE_WAY_CAP = "three-way-cap"
    PER_TYPE_OVERRIDE = "per-type-override"

    def kinds(self) -> tuple[SettingType, ...]:
        match self:
            case SettingComponent.TOGGLE:
                return tuple([SettingType.FLAG])
            case SettingComponent.NUMBER | SettingComponent.PER_TYPE_OVERRIDE:
                return tuple([SettingType.NUMBER])
            case SettingComponent.CHOICE:
                return tuple([SettingType.CHOICE])
            case SettingComponent.ENTRY_LIST:
                return tuple([SettingType.LIST])
            case SettingComponent.NUMBER_LIST:
                return tuple([SettingType.NUMBER_LIST])
            case SettingComponent.TEXT:
                return (SettingType.TEXT, SettingType.ANY)
            case SettingComponent.KEYED_CAP_TABLE | SettingComponent.THREE_WAY_CAP:
                return tuple([SettingType.LIST])

    @classmethod
    def default_for(cls, category: SettingType) -> "SettingComponent":
        match category:
            case SettingType.FLAG:
                return cls.TOGGLE
            case SettingType.NUMBER:
                return cls.NUMBER
            case SettingType.CHOICE:
                return cls.CHOICE
            case SettingType.LIST:
                return cls.ENTRY_LIST
            case SettingType.NUMBER_LIST:
                return cls.NUMBER_LIST
            case SettingType.TEXT:
                return cls.TEXT
            case SettingType.ANY:
                return cls.TEXT
