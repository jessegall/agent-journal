from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.environment import Environment
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class WorksShaper(Shaper):
    """Version 3 kept the work on a to-do as a row of its own; here a started task is its own work, with its log as sections."""

    type = "work"

    def __init__(self, tasks: Tasks, logs: TaskLogs) -> None:
        self.tasks, self.logs = tasks, logs

    def rows(self, environment: Environment) -> list[V3Row]:
        rows = []
        for t in self.tasks.in_(environment.id):
            if t.state == TaskState.OPEN:
                continue
            logged = self.logs.of(t)
            rows.append(V3Row.of("work", t, title=t.title, brief=t.brief, outcome=t.outcome, completed=seconds(t.finished_at), created=seconds(t.started_at) or seconds(t.created_at),
                                 sections=[{"title": "Log", "body": "\n".join(f"- {l.line}" for l in logged)}] if logged else [],
                                 data={"todo": t.id, "status": "open" if t.state == TaskState.STARTED else "done", "parked": False, "awaiting": "", "awaiting_since": 0, "awaiting_on": "", "logged": seconds(logged[-1].created_at) if logged else 0}))
        return rows
