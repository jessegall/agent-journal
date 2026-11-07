from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.module.module import Module


@dataclass(frozen=True)
class ButtonSlots:
    """The slots offered by installed modules and the module that owns each one."""

    modules: Sequence[type[Module]]

    @property
    def owners(self) -> Mapping[str, str]:
        return {slot: module.name for module in self.modules for slot in self.names(module)}

    @staticmethod
    def names(module: type[Module]) -> tuple[str, ...]:
        return (*(f"dock.{dock.type.value}" for dock in module.docks),
                *(f"row.{declaration.model.cli_name}" for declaration in module.models),
                *(f"row.{inspector.noun}" for inspector in module.inspectors if inspector.named), *module.button_slots)

    def problems(self) -> tuple[str, ...]:
        declared: dict[str, str] = {}
        problems: list[str] = []
        for module in self.modules:
            for slot in self.names(module):
                owner = declared.setdefault(slot, module.name)
                if owner != module.name:
                    problems.append(f"button slot {slot} is offered by both {owner} and {module.name}")
        return tuple(problems)
