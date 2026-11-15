from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.approve_difference.approve_difference import ApproveDifference
from core.modules.drivers.models.driver_comparison import DriverComparison
from core.modules.drivers.models.enums.difference_state import DifferenceState

APPROVED_REASON = "the comparisons of one kind of difference are approved together"


class ApproveDifferenceHandler(Handler[ApproveDifference, int]):
    """Marks every comparison of one kind of difference intended; only a person approves a difference."""

    command = ApproveDifference

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ApproveDifference, context: Context) -> int:
        if context.actor.is_agent():
            raise Refusal("only a person approves a difference of the new driver")
        rows = self.queries.query(DriverComparison).filter(difference_key=command.key, difference_state=DifferenceState.UNEXPLAINED).every_row(APPROVED_REASON)
        for row in rows:
            self.repository.save(row.changed(difference_state=DifferenceState.INTENDED), context)
        return len(rows)
