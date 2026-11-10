import json

from core.base.change.created import Created
from core.base.change.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from core.base.provider.providers import Providers
from engine.errors.refusal import Refusal
from core.modules.helpers.support.helper_settings import PROGRAM_SPLIT
from core.modules.helpers.support.program_share import ProgramShare
from core.modules.settings.models.setting import Setting


class ProgramSplitGuard(Guard[Created[Setting] | Updated[Setting]]):
    """Accepts an empty split or known programs whose percentages add to 100."""

    name = "helpers.program-split"
    is_safety = True

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def check(self, event: Created[Setting] | Updated[Setting], context: Context) -> None:
        if event.row.key != PROGRAM_SPLIT:
            return
        lines = json.loads(event.row.value)
        if not lines:
            return
        entries = [ProgramShare.parsed(line) for line in lines]
        program_names = {provider.name for provider in self.providers.all()}
        unknown = [entry.program for entry in entries if entry.program not in program_names]
        if unknown:
            raise Refusal(f"unknown program: {', '.join(unknown)}", "choose programs from the installed provider modules")
        if len({entry.program for entry in entries}) != len(entries):
            raise Refusal("a program appears twice in the split", "give each program one percentage")
        if sum(entry.percent for entry in entries) != 100:
            raise Refusal("program shares must add to 100", "set all percentages together, or clear the split")
