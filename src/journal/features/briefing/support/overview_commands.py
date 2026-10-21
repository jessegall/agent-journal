from functools import reduce

from journal.console.support.chained_line import ChainedLine
from journal.features.briefing.feature import Briefing
from journal.features.briefing.support.overview_slot import OverviewSlot
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks


class OverviewCommands:
    """The journal lines the overview after a compaction or a takeover hands the console to run, in the order the setting names them; one that names the plan or task in hand while there is none says so instead."""

    def __init__(self, settings: SettingRows, plans: Plans, tasks: Tasks) -> None:
        self.settings, self.plans, self.tasks = settings, plans, tasks

    def lines(self) -> list[ChainedLine]:
        slots = self.slots()
        return [self.line(command, slots) for command in self.settings.option(Briefing.OVERVIEW_COMMANDS)]

    def slots(self) -> tuple[OverviewSlot, ...]:
        plan = next((p for p in self.plans.scoped() if p.state == PlanState.STARTED), None)
        task = self.tasks.current()
        return (OverviewSlot("started_plan", str(plan.id) if plan else "", "no plan is started"), OverviewSlot("task_in_hand", str(task.id) if task else "", "no task is in hand"))

    def line(self, command: str, slots: tuple[OverviewSlot, ...]) -> ChainedLine:
        missing = next((slot for slot in slots if slot.is_missing(command)), None)
        if missing:
            return ChainedLine.missing(command, missing.absent)
        return ChainedLine.runnable(reduce(lambda text, slot: slot.filled(text), slots, command))
