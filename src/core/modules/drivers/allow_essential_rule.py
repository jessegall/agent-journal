from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.setting import Setting


@dataclass(frozen=True)
class AllowEssentialRule(Command[Setting]):
    """Allows a rule its module marks essential to be asked as essential, for the whole project."""

    rule: str
