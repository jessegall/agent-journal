from datetime import datetime, timezone

from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.repositories.plans import PLAN_LINK
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers


class TaskController(Controller[Task]):
    """Tasks with the plan each is in and the worker that holds it; started from the viewer, a task is taken up by the current agent."""

    def __init__(self, tasks: Tasks, logs: TaskLogs, workers: Workers) -> None:
        self.repository, self.task_logs, self.workers = tasks, logs, workers

    def rows(self) -> list[Task]:
        return self.repository.shown()

    def is_open(self, row: Task) -> bool:
        return not row.is_closed()

    def counts(self, rows: list[Task]) -> Counts:
        return Counts(all=self.repository.count(), open=self.repository.unfinished_count(), unread=self.repository.unviewed())

    def shown_page(self, rows: list[Task]) -> list[dict]:
        plans, holders = self.repository.linked(PLAN_LINK), self.workers.containing({t.id for t in rows})
        return [{**ModelFields.build(t), "plan_id": plans[t.id][0].id if t.id in plans else None, "worker_id": holders[t.id].id if t.id in holders else None} for t in rows]

    def start(self, request: Request) -> Response:
        task = self.repository.save(self.repository.find(request.number("id")).started(self.time()), request.actor)
        return Response.json(self.shown(task))

    def finish(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.finished(self.time(), request.body.get("how", "")), request.actor)))

    def reopen(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.with_(state=TaskState.OPEN, finished_at=None, outcome=""), request.actor)))

    def logs(self, request: Request) -> Response:
        return Response.json(self.task_logs.logs(self.repository.find(request.number("id"))))

    def log(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.task_logs.save(TaskLog.build(task, request.body.get("line", ""), self.time().timestamp()), request.actor), 201)

    @staticmethod
    def time() -> datetime:
        return datetime.now(timezone.utc)
