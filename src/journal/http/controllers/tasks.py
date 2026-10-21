from datetime import datetime, timezone

from journal.features.tasks.support.waits import Waits
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
    """Tasks with the plan each is in, the worker that holds it and what it waits on; started from the viewer, a task is taken up by the current agent."""

    repository: Tasks

    def __init__(self, tasks: Tasks, logs: TaskLogs, workers: Workers, waits: Waits) -> None:
        self.repository, self.task_logs, self.workers, self.waits = tasks, logs, workers, waits

    def rows(self) -> list[Task]:
        return self.repository.shown()

    def is_open(self, row: Task) -> bool:
        return not row.is_closed()

    def counts(self, rows: list[Task]) -> Counts:
        return Counts(all=self.repository.count(), open=self.repository.unfinished_count(), unread=self.repository.unviewed())

    def shown_page(self, rows: list[Task]) -> list[dict]:
        plans, holders, waits = self.repository.linked(PLAN_LINK), self.workers.containing({t.row_id for t in rows}), self.repository.open_wait_refs(rows)
        return [{**ModelFields.build(t), "plan_id": plans[t.row_id][0].id if t.row_id in plans else None, "worker_id": holders[t.row_id].id if t.row_id in holders else None,
                 "waits": [str(ref) for ref in waits.get(t.row_id, [])]} for t in rows]

    def start(self, request: Request) -> Response:
        task = self.repository.save(self.repository.find(request.number("id")).started(self.time()), request.actor)
        return Response.json(self.shown(task))

    def finish(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.finished(self.time(), request.body.get("how", "")), request.actor)))

    def reopen(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.with_(state=TaskState.OPEN, finished_at=None, outcome=""), request.actor)))

    def suspend(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.suspended(request.body.get("why", ""), self.time()), request.actor)))

    def block(self, request: Request) -> Response:
        reason, enabled, deadline = request.body.get("why", ""), request.body.get("on", []), request.body.get("until", "")
        self.waits.refuse_unnamed(reason, enabled, deadline)
        task = self.repository.save(self.repository.find(request.number("id")).blocked(reason, self.time()), request.actor)
        self.waits.linked(task, enabled, deadline, request.body.get("every", 2), request.actor)
        return Response.json(self.shown(task))

    def unblock(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.unblocked("the user opened it", self.time().timestamp()), request.actor)))

    def logs(self, request: Request) -> Response:
        return Response.json(self.task_logs.logs(self.repository.find(request.number("id"))))

    def log(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.task_logs.save(TaskLog.build(task, request.body.get("line", ""), self.time().timestamp()), request.actor), 201)

    @staticmethod
    def time() -> datetime:
        return datetime.now(timezone.utc)
