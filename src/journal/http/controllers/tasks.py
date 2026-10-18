from datetime import datetime, timezone

from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.repositories.not_found import NotFound
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class TaskController(Controller[Task]):
    def __init__(self, tasks: Tasks, logs: TaskLogs) -> None:
        self.repository, self.logs = tasks, logs

    def start(self, request: Request) -> Response:
        return self._change(request, lambda task: task.started(self._now()))

    def finish(self, request: Request) -> Response:
        return self._change(request, lambda task: task.finished(self._now(), request.body.get("how", "")))

    def log(self, request: Request) -> Response:
        try:
            task = self.repository.find(request.number("id"))
        except NotFound as missing:
            return Response.missing(missing)
        line = self.logs.save(TaskLog(environment_id=task.environment_id, task_id=task.id, line=request.body.get("line", "")), request.actor)
        return Response.json(line, 201)

    def _change(self, request: Request, change) -> Response:
        try:
            task = self.repository.find(request.number("id"))
        except NotFound as missing:
            return Response.missing(missing)
        return Response.json(self.repository.save(change(task), request.actor))

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)
