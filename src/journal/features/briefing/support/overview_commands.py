import shlex
from functools import reduce

from journal.console.console import Console
from journal.features.briefing.feature import Briefing
from journal.features.briefing.support.overview_slot import OverviewSlot
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from journal.support.caller import Caller


class OverviewCommands:
    """The journal commands the overview after a compaction or a takeover runs, in the order the setting names them, each printed under its heading; one that names the plan or task in hand while there is none says so instead."""

    def __init__(self, console: Console, settings: SettingRows, plans: Plans, tasks: Tasks) -> None:
        self.console, self.settings, self.plans, self.tasks = console, settings, plans, tasks

    def sections(self, caller: Caller) -> list[str]:
        slots = self.slots()
        return [self.section(command, slots, caller) for command in self.settings.option(Briefing.OVERVIEW_COMMANDS)]

    def slots(self) -> tuple[OverviewSlot, ...]:
        plan = next((p for p in self.plans.scoped() if p.state == PlanState.STARTED), None)
        task = self.tasks.current()
        return (OverviewSlot("started_plan", str(plan.id) if plan else "", "no plan is started"), OverviewSlot("task_in_hand", str(task.id) if task else "", "no task is in hand"))

    def section(self, command: str, slots: tuple[OverviewSlot, ...], caller: Caller) -> str:
        missing = next((slot for slot in slots if slot.is_missing(command)), None)
        if missing:
            return f"== journal {command} ==\n{missing.absent}"
        line = reduce(lambda text, slot: slot.filled(text), slots, command)
        outcome = self.console.run(shlex.split(line), caller)
        return f"== journal {line} ==\n{(outcome.text or outcome.error).rstrip() or 'nothing'}"
