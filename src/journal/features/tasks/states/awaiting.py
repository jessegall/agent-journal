from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.row_settled import RowSettled
from journal.events.rows.worker_back import WorkerBack
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.support.permission import Permission

NEXT_TASK_DELAY_SECONDS = 60.0
CHECK_REMINDER_INTERVAL_SECONDS = 300.0
WORKERS = "workers"


@dataclass(frozen=True)
class Awaiting(Wait):
    """The agent waits on something outside its hands, named in words and by the rows that end it, table:id each: workers, outputs, checks, tasks or questions. Each row settling is told and the last pops the wait with what each came to. A wait on workers stands through the agent's own tool use, since it works on meanwhile and is widened by each dispatch; any other wait is lifted when the agent works again. Stopping is fine; in auto mode the next task is named once after a minute, and every five quiet minutes the agent is asked to look."""

    name = "awaiting"
    title = "Waiting"
    allows = frozenset({Permission.FILE_EDITS, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    what: str = ""
    ends_on: str = ""
    start_time: float = 0.0
    reminder_time: float = 0.0
    next_task_named: bool = False
    outcomes: str = ""

    @classmethod
    def on_workers(cls, ids: tuple[int, ...], start_time: float) -> "Awaiting":
        return cls(what=f"{WORKERS} {', '.join(str(n) for n in ids)}", ends_on=",".join(f"{WORKERS}:{n}" for n in ids), start_time=start_time)

    def awaiting(self) -> tuple[str, str]:
        return self.what, self.ends_on

    def waits_on(self) -> list[str]:
        return [ref for ref in self.ends_on.split(",") if ref]

    def worker_ids(self) -> tuple[int, ...]:
        return tuple(int(ref.split(":")[1]) for ref in self.waits_on() if ref.startswith(f"{WORKERS}:"))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        if event.subagent or event.call.is_journal or self.worker_ids():
            return self.unchanged()
        return self.pop()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        next_open = event.data.of(Tasks).next_open
        if settings.of(Tasks.AUTO) and not self.next_task_named and event.time - self.start_time >= NEXT_TASK_DELAY_SECONDS and next_open is not None:
            return self.changed(replace(self, next_task_named=True), Tasks.WAIT_NEXT_TASK.create(what=self.what, n=next_open.id, title=next_open.title))
        if event.time - max(self.start_time, self.reminder_time) >= CHECK_REMINDER_INTERVAL_SECONDS:
            return self.changed(replace(self, reminder_time=event.time), Tasks.WAIT_CHECK.create(what=self.what, minutes=int((event.time - self.start_time) // 60)))
        return self.unchanged()

    def on_row_settled(self, event: RowSettled, settings: Settings) -> Transition:
        return self.ended_by(event.ref, event.outcome)

    def on_worker_dispatched_workers(self, event: WorkerDispatched, settings: Settings) -> Transition:
        if event.dispatched_by != event.session or event.worker_id in self.worker_ids():
            return self.unchanged()
        widened = Awaiting.on_workers((*self.worker_ids(), event.worker_id), self.start_time)
        return self.changed(replace(self, what=widened.what, ends_on=",".join([*self.waits_on(), f"{WORKERS}:{event.worker_id}"])))

    def on_worker_back_workers(self, event: WorkerBack, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.ended_by(f"{WORKERS}:{event.worker_id}", f"worker {event.worker_id}, {event.name}, reported", Workers.WORKER_REPORTED.create(n=event.worker_id, name=event.name))

    def on_worker_stopped_workers(self, event: WorkerStopped, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.ended_by(f"{WORKERS}:{event.worker_id}", f"worker {event.worker_id}, {event.name}, stopped before it reported", Workers.WORKER_STOPPED_UNREPORTED.create(n=event.worker_id, name=event.name))

    def ended_by(self, ref: str, outcome: str, *lines: Nudge) -> Transition:
        from journal.features.tasks.feature import Tasks
        if ref not in self.waits_on():
            return self.unchanged()
        left = [waited for waited in self.waits_on() if waited != ref]
        outcomes = "; ".join(part for part in (self.outcomes, outcome) if part)
        if left:
            return self.changed(replace(self, ends_on=",".join(left), outcomes=outcomes), *lines)
        return self.pop(*lines, Tasks.WAIT_END.create(what=self.what, outcome=outcomes))
