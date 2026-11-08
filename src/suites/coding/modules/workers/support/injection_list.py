from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from suites.coding.modules.workers.support.instruction_injection import InstructionInjection


@dataclass(frozen=True)
class InjectionList:
    """The injections a profile can have in its instruction files, each with its title and whether the profile has it on."""

    profile: str
    injections: tuple[InstructionInjection, ...]

    @property
    def rows(self) -> Sequence[Mapping[str, object]]:
        return [{"key": injection.key, "title": injection.title, "state": "on" if injection.is_on else "off"} for injection in self.injections]

    def json(self) -> Mapping[str, object]:
        return {"profile": self.profile, "rows": list(self.rows)}
