from functools import reduce

from journal.console.support.chained_line import ChainedLine
from journal.features.briefing.feature import Briefing
from journal.features.briefing.support.overview_slot import OverviewSlot
from journal.features.tasks.active_task import ActiveTask
from journal.models.plan_state import PlanState
from journal.models.support.ref import Ref
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from journal.support.caller import Caller


class OverviewCommands:
    """The journal lines the overview after a compaction or a takeover hands the console to run, in the order the setting names them; one that names the plan or the caller's own task in hand while there is none says so instead."""

    def __init__(self, settings: SettingRows, plans: Plans, tasks: Tasks, taking: ActiveTask) -> None:
        self.settings, self.plans, self.tasks, self.taking = settings, plans, tasks, taking

    def lines(self, caller: Caller) -> list[ChainedLine]:
        slots = self.slots(self.taking.holder(caller))
        return [self.line(command, slots) for command in self.settings.texts(Briefing.OVERVIEW_COMMANDS)]

    def slots(self, holder: Ref | None) -> tuple[OverviewSlot, ...]:
        plan = next((p for p in self.plans.scoped() if p.state == PlanState.STARTED), None)
        task = None if holder is None else self.tasks.holder_task(holder)
        return (OverviewSlot("started_plan", str(plan.id) if plan else "", "no plan is started"), OverviewSlot("task_in_hand", str(task.id) if task else "", "no task is in hand"))

    def line(self, command: str, slots: tuple[OverviewSlot, ...]) -> ChainedLine:
        missing = next((slot for slot in slots if slot.is_missing(command)), None)
        if missing:
            return ChainedLine.missing(missing.emptied(command), missing.absent)
        return ChainedLine.runnable(reduce(lambda text, slot: slot.filled(text), slots, command))
