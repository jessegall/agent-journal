from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.settings.models.setting import Setting


@dataclass(frozen=True)
class ChooseDriver(Command[Setting]):
    """Chooses the driver that drives an environment's agents of the driver's role."""

    driver: str
