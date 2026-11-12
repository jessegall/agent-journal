from dataclasses import dataclass

from engine.command.command import Command
from core.modules.settings.support.current_setting import CurrentSetting


@dataclass(frozen=True)
class SetContextCap(Command[CurrentSetting]):
    """Sets the context size at which agents of one helper type are compacted: a number of tokens, none for no cap,
    or default to take the type's entry out so its kind of agent decides."""

    profile: str
    cap: str
