from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_lines import SettingLines


@dataclass(frozen=True)
class SettingTreeRow:
    """One setting or group as the settings window draws it: what it is, where it sits, what it holds now as
    shown to a person, and where that came from; a secret's value is never in it."""

    key: str
    module: str
    parent: str | None
    title: str
    description: str
    type: str
    value: object
    shown: str
    source: str
    secret: bool
    scope: str
    agent_writable: bool
    choices: Sequence[str]
    toggleable: bool

    @classmethod
    def listed(cls, setting: CurrentSetting) -> "SettingTreeRow":
        entry = setting.entry
        return cls(entry.key, entry.module, entry.parent, entry.title, entry.description, entry.type, None if entry.secret else setting.value, SettingLines.shown(setting),
                   setting.source, entry.secret, entry.scope, entry.agent_writable, tuple(entry.choices), entry.toggleable)
