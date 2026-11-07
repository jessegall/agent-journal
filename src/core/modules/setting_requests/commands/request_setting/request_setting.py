from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.setting_requests.models.setting_request import SettingRequest


@dataclass(frozen=True)
class RequestSetting(Command[SettingRequest]):
    """Asks a person to change a setting only a person may change, with the reason the agent gives."""

    key: str
    text: str
    reason: str
    project: bool = False
