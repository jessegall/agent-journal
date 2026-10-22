from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_reports import WorkerReports
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.features.workers.support.worker_task_view import WorkerTaskView
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.models.support.ref import Ref
from journal.repositories.proofs import Proofs
from journal.repositories.tasks import Tasks
from journal.repositories.worker_todos import WorkerTodos
from journal.repositories.workers import Workers


class WorkerController(Controller[Worker]):
    """The workers sent from here, each with the last report it filed; one stopped is closed. Each carries the task it holds, the task's points, its to-do items and the latest proof of each point. The viewer sends one its next job, stops it, retires it, checks a proof, sends one back short or merges its work, as the commands do."""

    repository: Workers

    def __init__(self, workers: Workers, reports: WorkerReports, actions: WorkerActions, tasks: Tasks, proofs: Proofs, todos: WorkerTodos) -> None:
        self.repository, self.reports, self.actions, self.tasks, self.proofs, self.todos = workers, reports, actions, tasks, proofs, todos

    def check(self, request: Request) -> Response:
        self.actions.check(request.number("id"), int(request.body.get("point", 0)), request.actor)
        return Response.json(self.shown(self.repository.find(request.number("id"))))

    def short_check(self, request: Request) -> Response:
        self.actions.short_check(request.number("id"), int(request.body.get("point", 0)), str(request.body.get("shortfall", "")), request.actor)
        return Response.json(self.shown(self.repository.find(request.number("id"))))

    def merge(self, request: Request) -> Response:
        self.actions.merge(request.number("id"), request.actor)
        return Response.json(self.shown(self.repository.find(request.number("id"))))

    def release(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.release(request.number("id"), request.actor)))

    def send(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.send(request.number("id"), str(request.body.get("brief", "")), "", request.actor)))

    def stop(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.stop(request.number("id"), str(request.body.get("why", "")), request.actor)))

    def complete(self, request: Request) -> Response:
        return Response.json(self.shown(self.actions.complete(request.number("id"), str(request.body.get("why", "")), request.actor)[0]))

    def rows(self) -> list[Worker]:
        return self.repository.scoped()

    def is_open(self, row: Worker) -> bool:
        return row.state != WorkerState.STOPPED

    def shown_page(self, rows: list[Worker]) -> list[dict]:
        return [{**ModelFields.build(w), "report": self.reports.last(w), "files": w.files_line(), "task": self.task_view(w)} for w in rows]

    def task_view(self, worker: Worker) -> WorkerTaskView:
        holdings = self.tasks.holder_task_ids(Ref.build(worker))
        if not holdings:
            return WorkerTaskView()
        task = self.tasks.find(holdings[0])
        return WorkerTaskView.built(task, self.todos.task_items(task), self.proofs.task_proofs(task))
