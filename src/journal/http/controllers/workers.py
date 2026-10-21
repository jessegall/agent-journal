from journal.features.workers.support.worker_reports import WorkerReports
from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers


class WorkerController(Controller[Worker]):
    """The workers sent from here, each with the last report it filed; one stopped is closed."""

    def __init__(self, workers: Workers, reports: WorkerReports) -> None:
        self.repository, self.reports = workers, reports

    def rows(self) -> list[Worker]:
        return self.repository.in_()

    def is_open(self, row: Worker) -> bool:
        return row.state != WorkerState.STOPPED

    def shown_page(self, rows: list[Worker]) -> list[dict]:
        return [{**ModelFields.build(w), "report": self.reports.last(w)} for w in rows]
