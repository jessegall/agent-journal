from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class TaskController(Controller):
    def __init__(self, tasks: Tasks, logs: TaskLogs) -> None: ...

    def start(self, request: Request) -> Response: ...

    def finish(self, request: Request) -> Response: ...

    def log(self, request: Request) -> Response: ...
