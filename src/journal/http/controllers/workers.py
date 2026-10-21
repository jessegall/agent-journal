from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_reports import WorkerReports
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers


class WorkerController(Controller[Worker]):
    """The workers sent from here, each with the last report it filed; one stopped is closed. The viewer sends one its next job, stops it or retires it as the command does."""

    repository: Workers

    def __init__(self, workers: Workers, reports: WorkerReports, actions: WorkerActions) -> None:
        self.repository, self.reports, self.actions = workers, reports, actions

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
        return [{**ModelFields.build(w), "report": self.reports.last(w), "files": w.files_line()} for w in rows]
