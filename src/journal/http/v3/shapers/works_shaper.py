from journal.http.v3.current_work import CurrentWork
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class WorksShaper(Shaper):
    """Version 3 kept the work on a to-do as a row of its own; here a started task is its own work, with its log as sections, and what the live agent waits for on it."""

    type = "work"

    def __init__(self, tasks: Tasks, logs: TaskLogs, agents: Agents, current: CurrentWork) -> None:
        self.tasks, self.logs, self.agents, self.current = tasks, logs, agents, current

    def rows(self) -> list[V3Row]:
        live = self.agents.live()
        held = self.current.of(live) if live else None
        return [self.row(t, held if held and held.task.id == t.id else None) for t in self.tasks.shown() if t.state not in (TaskState.OPEN, TaskState.BLOCKED)]

    def row(self, t, held) -> V3Row:
        logged = self.logs.of(t)
        data = {"todo": t.id, "status": "open" if t.state in (TaskState.STARTED, TaskState.PARKED) else "done", "parked": t.state == TaskState.PARKED, "parked_why": t.parked_why, "awaiting": held.awaiting if held else "", "awaiting_since": seconds(t.updated_at) if held and held.awaiting else 0,
                "awaiting_on": held.awaiting_on if held else "", "logged": seconds(logged[-1].created_at) if logged else 0}
        return V3Row.of("work", t, title=t.title, brief=t.brief, outcome=t.outcome, completed=seconds(t.finished_at), created=seconds(t.started_at) or seconds(t.created_at),
                        sections=[{"title": "Log", "body": "\n".join(f"- {l.line}" for l in logged)}] if logged else [], data=data)
