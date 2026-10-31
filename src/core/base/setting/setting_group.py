from collections.abc import Sequence
from dataclasses import dataclass, field

from core.base.setting.setting_reference import SettingReference
from core.base.setting.setting_value import SettingValue


@dataclass(frozen=True)
class SettingGroup:
    """A group of settings a module declares, holding values, other groups and references to groups other
    modules declare; a toggleable group can be switched off as a whole, which switches off every setting
    inside it, and is on or off by default as enabled says; a group with any_key also admits any key under
    it as a setting like that value, for keys made at run time, such as one per role or per window."""

    key: str
    title: str
    description: str
    children: Sequence["SettingGroup | SettingValue | SettingReference"] = field(default_factory=tuple)
    toggleable: bool = False
    enabled: bool = True
    any_key: SettingValue | None = None
