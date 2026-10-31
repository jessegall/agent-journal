from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.setting import Setting


@dataclass(frozen=True)
class ChooseSuite(Command[Setting]):
    """Chooses the suite an environment runs."""

    suite: str
