from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.drivers.commands.support.environment_menu_choice import EnvironmentMenuChoice


@dataclass(frozen=True)
class EnvironmentMenu:
    """The environments the boot menu offers, as journal environment menu prints them."""

    choices: tuple[EnvironmentMenuChoice, ...]

    def lines(self) -> str:
        return "\n".join(choice.line() for choice in self.choices)

    def json(self) -> Mapping[str, object]:
        return {"rows": [choice.json() for choice in self.choices]}
