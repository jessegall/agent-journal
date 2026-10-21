from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.row_resolved import RowResolved
from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.support.permission import Permission

NEXT_TASK_DELAY_SECONDS = 60.0
CHECK_REMINDER_INTERVAL_SECONDS = 300.0
WORKERS = "workers"


@dataclass(frozen=True)
class ExternalWait(Wait):
    """The agent waits on something outside its hands, named in words and by the rows that end it, table:id each: workers, outputs, checks, tasks or questions. Each row settling is told and the last pops the wait with what each came to. A wait on workers stands through the agent's own tool use, since it works on meanwhile and is widened by each dispatch; any other wait is lifted when the agent works again. Stopping is fine; in auto mode the next task is named once after a minute, and every five quiet minutes the agent is asked to look."""

    name = "awaiting"
    title = "Waiting"
    allows = frozenset({Permission.FILE_EDITS, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    focus: str = ""
    end_refs: str = ""
    started_at: float = 0.0
    reminded_at: float = 0.0
    next_task_reported: bool = False
    outcomes: str = ""

    @classmethod
    def on_workers(cls, ids: tuple[int, ...], started_at: float) -> "ExternalWait":
        return cls(focus=f"{WORKERS} {', '.join(str(n) for n in ids)}", end_refs=",".join(f"{WORKERS}:{n}" for n in ids), started_at=started_at)

    def wait_description(self) -> tuple[str, str]:
        return self.focus, self.end_refs

    def targets(self) -> list[str]:
        return [ref for ref in self.end_refs.split(",") if ref]

    def worker_ids(self) -> tuple[int, ...]:
        return tuple(int(ref.split(":")[1]) for ref in self.targets() if ref.startswith(f"{WORKERS}:"))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        if event.subagent or event.call.is_journal or self.worker_ids():
            return self.none()
        return self.pop()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        next_open = event.data.part(Tasks).next_open
        if settings.value(Tasks.AUTO) and not self.next_task_reported and event.time - self.started_at >= NEXT_TASK_DELAY_SECONDS and next_open is not None:
            return self.swap(replace(self, next_task_reported=True), Tasks.WAIT_NEXT_TASK.create(what=self.focus, n=next_open.id, title=next_open.title))
        if event.time - max(self.started_at, self.reminded_at) >= CHECK_REMINDER_INTERVAL_SECONDS:
            return self.swap(replace(self, reminded_at=event.time), Tasks.WAIT_CHECK.create(what=self.focus, minutes=int((event.time - self.started_at) // 60)))
        return self.none()

    def on_row_resolved(self, event: RowResolved, settings: Settings) -> Transition:
        return self.resolution(event.ref, event.outcome)

    def on_worker_dispatched_workers(self, event: WorkerDispatched, settings: Settings) -> Transition:
        if event.dispatcher != event.session or event.worker_id in self.worker_ids():
            return self.none()
        widened = ExternalWait.on_workers((*self.worker_ids(), event.worker_id), self.started_at)
        return self.swap(replace(self, focus=widened.focus, end_refs=",".join([*self.targets(), f"{WORKERS}:{event.worker_id}"])))

    def on_worker_reported_workers(self, event: WorkerReported, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.resolution(f"{WORKERS}:{event.worker_id}", f"worker {event.worker_id}, {event.name}, reported", Workers.WORKER_REPORTED.create(n=event.worker_id, name=event.name))

    def on_worker_stopped_workers(self, event: WorkerStopped, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.resolution(f"{WORKERS}:{event.worker_id}", f"worker {event.worker_id}, {event.name}, stopped before it reported", Workers.WORKER_STOPPED_UNREPORTED.create(n=event.worker_id, name=event.name))

    def resolution(self, ref: str, outcome: str, *lines: Nudge) -> Transition:
        from journal.features.tasks.feature import Tasks
        if ref not in self.targets():
            return self.none()
        remaining = [waited for waited in self.targets() if waited != ref]
        outcomes = "; ".join(part for part in (self.outcomes, outcome) if part)
        if remaining:
            return self.swap(replace(self, end_refs=",".join(remaining), outcomes=outcomes), *lines)
        return self.pop(*lines, Tasks.WAIT_END.create(what=self.focus, outcome=outcomes))
