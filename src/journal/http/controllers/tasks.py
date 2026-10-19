import time
from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.features.tasks.states.working import Working
from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.model_fields import ModelFields
from journal.http.request import Request
from journal.http.response import Response
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.plans import IN_PLAN
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers


class TaskController(Controller[Task]):
    """Tasks with the plan each is in and the worker that holds it; started from the viewer, a task is taken up by the live agent."""

    def __init__(self, tasks: Tasks, logs: TaskLogs, workers: Workers, agents: Agents, machine: Machine) -> None:
        self.repository, self.logs, self.workers, self.agents, self.machine = tasks, logs, workers, agents, machine

    def rows(self) -> list[Task]:
        return self.repository.shown()

    def is_open(self, row: Task) -> bool:
        return not row.is_closed()

    def counts(self, rows: list[Task]) -> Counts:
        return Counts(all=self.repository.counted_in(), open=self.repository.unfinished_count(), unread=self.repository.unseen_by_user())

    def shown_page(self, rows: list[Task]) -> list[dict]:
        """Each task with the plan it is in and the worker that holds it."""
        plans, holders = self.repository.linked(IN_PLAN), self.workers.holding({t.id for t in rows})
        return [{**ModelFields.of(t), "plan_id": plans[t.id][0].id if t.id in plans else None, "worker_id": holders[t.id].id if t.id in holders else None} for t in rows]

    def start(self, request: Request) -> Response:
        task = self.repository.save(self.repository.find(request.number("id")).started(self.now()), request.actor)
        live = self.agents.live()
        if live:
            self.machine.move(live.session, task.environment_id, Working(task_id=task.id, logged_at=time.time()))
        return Response.json(self.shown(task))

    def finish(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.finished(self.now(), request.body.get("how", "")), request.actor)))

    def reopen(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(task.with_(state=TaskState.OPEN, finished_at=None, outcome=""), request.actor)))

    def logs(self, request: Request) -> Response:
        return Response.json(self.logs.of(self.repository.find(request.number("id"))))

    def log(self, request: Request) -> Response:
        task = self.repository.find(request.number("id"))
        return Response.json(self.logs.save(TaskLog(environment_id=task.environment_id, task_id=task.id, line=request.body.get("line", "")), request.actor), 201)

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)
