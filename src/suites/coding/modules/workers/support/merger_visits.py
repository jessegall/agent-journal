from dataclasses import replace

from engine.command.context import Context
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.merger_visit import MergerVisit

OPEN_VISITS_REASON = "every line of every open merger visit that was not handled goes back"


class MergerVisits:
    """Closes the merger's readings; the lines of a reading it did nothing about come back once, and a worker's
    question comes back after every reading until it has an outcome."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def close_newest(self, context: Context) -> None:
        visit = self.queries.query(MergerVisit).matching(IsNull("closed_at")).newest().first()
        if visit is not None:
            self.close(visit, context)

    def return_unhandled_lines(self, context: Context) -> None:
        for visit in self.queries.query(MergerVisit).matching(IsNull("closed_at")).every_row(OPEN_VISITS_REASON):
            for line in self.queries.query(MergerLine).filter(visit_id=visit.id).every_row(OPEN_VISITS_REASON):
                if line.returned_at is None or line.is_open_question():
                    self.repository.save_change(line, replace(line, read_at=None, read_output_id=None, returned_at=context.timestamp), context)
            self.close(visit, context)

    def close(self, visit: MergerVisit, context: Context) -> None:
        self.repository.save_change(visit, replace(visit, closed_at=context.timestamp), context)
