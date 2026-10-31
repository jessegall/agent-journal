import json
from collections.abc import Sequence
from dataclasses import asdict, dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.provider.program_row import ProgramRow
from core.base.provider.provider import Provider


@dataclass(frozen=True)
class ProgramTable:
    """Every provider's row, with the journal's event names, as programs.json gives them to the Go hook program."""

    providers: Sequence[type[Provider]]

    def text(self) -> str:
        programs = {provider.name: asdict(ProgramRow.row(provider)) for provider in self.providers}
        events = [name.value for name in HookEventName if name is not HookEventName.TICK]
        return json.dumps({"events": events, "programs": programs}, indent=2, sort_keys=True) + "\n"
