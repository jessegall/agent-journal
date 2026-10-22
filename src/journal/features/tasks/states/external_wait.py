from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.row_pending import RowPending
from journal.events.rows.row_resolved import RowResolved
from journal.support.permission import Permission
from journal.support.timeout import Timeout

NEXT_TASK_DELAY = Timeout.minutes(1)
CHECK_REMINDER = Timeout.minutes(5)


@dataclass(frozen=True)
class ExternalWait(Wait):
    """The agent waits on something outside its hands, named in words and by the rows that end it, table:id each: outputs, checks, tasks or questions, and whatever a feature above tasks adds. Each row settling is told and the last pops the wait with what each came to. The wait is lifted when the agent uses any tool outside the journal. Stopping is fine; in auto mode the next task is named once after a minute, and every five quiet minutes the agent is asked to look."""

    name = "awaiting"
    title = "Waiting"
    allows = frozenset({Permission.FILE_EDITS, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    focus: str = ""
    end_refs: str = ""
    started_at: float = 0.0
    next_task_delay: Timeout = NEXT_TASK_DELAY
    check_reminder: Timeout = CHECK_REMINDER
    next_task_reported: bool = False
    outcomes: str = ""

    @classmethod
    def opened(cls, focus: str, end_refs: str, started_at: float) -> "ExternalWait":
        return cls(focus=focus, end_refs=end_refs, started_at=started_at, next_task_delay=NEXT_TASK_DELAY.started(started_at), check_reminder=CHECK_REMINDER.started(started_at))

    def wait_description(self) -> tuple[str, str]:
        return self.focus, self.end_refs

    def targets(self) -> list[str]:
        return [ref for ref in self.end_refs.split(",") if ref]

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        if event.subagent or event.call.is_journal:
            return self.none()
        return self.pop()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        next_open = event.data.part(Tasks).next_open
        if settings.value(Tasks.AUTO) and not self.next_task_reported and self.next_task_delay.is_elapsed(event.time) and next_open is not None:
            return self.swap(replace(self, next_task_reported=True), Tasks.WAIT_NEXT_TASK.create(what=self.focus, n=next_open.id, title=next_open.title))
        if self.check_reminder.is_elapsed(event.time):
            return self.swap(replace(self, check_reminder=self.check_reminder.started(event.time)), Tasks.WAIT_CHECK.create(what=self.focus, minutes=int((event.time - self.started_at) // 60)))
        return self.none()

    def on_row_resolved(self, event: RowResolved, settings: Settings) -> Transition:
        return self.resolution(event.ref, event.outcome)

    def on_row_pending(self, event: RowPending, settings: Settings) -> Transition:
        if event.awaiter != event.session:
            return self.none()
        event.stop_propagation()
        if event.ref in self.targets():
            return self.none()
        return self.swap(replace(self, focus=f"{self.focus}, {event.label}", end_refs=",".join([*self.targets(), event.ref])))

    def resolution(self, ref: str, outcome: str, *lines: Nudge) -> Transition:
        from journal.features.tasks.feature import Tasks
        if ref not in self.targets():
            return self.none()
        remaining = [waited for waited in self.targets() if waited != ref]
        outcomes = "; ".join(part for part in (self.outcomes, outcome) if part)
        if remaining:
            return self.swap(replace(self, end_refs=",".join(remaining), outcomes=outcomes), *lines)
        return self.pop(*lines, Tasks.WAIT_END.create(what=self.focus, outcome=outcomes))
