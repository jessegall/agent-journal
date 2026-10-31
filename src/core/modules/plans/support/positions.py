from core.base.command.context import Context
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask

POSITION = "position"


class Positions:
    """Keeps the places of a plan's phases and of a phase's tasks without gaps: a new one takes the place
    after the last, and when one leaves, every later one moves up by one, nearest first, so no two ever
    share a place."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def next_position(self, model: type[Phase] | type[PhaseTask], parent_column: str, parent_id: int) -> int:
        highest = self.queries.query(model).filter(**{parent_column: parent_id}).descending(POSITION).page(1, 1).rows
        return highest[0].position + 1 if highest else 1

    def renumber(self, model: type[Phase] | type[PhaseTask], parent_column: str, parent_id: int, position: int, context: Context) -> None:
        later = self.queries.query(model).filter(**{parent_column: parent_id}).matching(Greater(POSITION, position)).ordered(POSITION)
        for row in tuple(later.all_rows()):
            self.repository.save(row.changed(position=row.position - 1), context)
