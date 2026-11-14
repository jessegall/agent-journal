from dataclasses import dataclass

from engine.command.command import Command
from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class SetProfileLimits(Command[CurrentSetting]):
    """Sets how many agents of one profile may run and be kept in the caller's environment: the profile's entry in
    the limits list of its agent type, with the entries of the other profiles left as they are."""

    agent_type: str
    profile: str
    run: int
    kept: int
