from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.module.module import Module


@dataclass(frozen=True)
class InspectorSlots:
    """The inspector slots of the installed models, one for each model, and the module that owns each one."""

    modules: Sequence[type[Module]]

    @property
    def owners(self) -> Mapping[str, str]:
        return {f"inspector.{declaration.model.cli_name}": module.name for module in self.modules for declaration in module.models}

    def problems(self, module: type[Module], window_name: str, slots: Sequence[str]) -> list[str]:
        owners = self.owners
        problems = [f"the window {window_name} uses unknown slot {slot}" for slot in slots if slot not in owners]
        problems += [f"the window {window_name} uses slot {slot} of {owners[slot]}, which it depends on only when listed in dependencies"
                     for slot in slots if slot in owners and owners[slot] != module.name and owners[slot] not in module.dependencies]
        return problems
