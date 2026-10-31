from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.query import Query
from core.modules.reviews.models.enums.reviewer_state import ReviewerState
from core.modules.reviews.models.reviewer import Reviewer

ACTIVE = (ReviewerState.IDLE, ReviewerState.REVIEWING)


class ReviewerQuery(Query[Reviewer]):
    """Reads reviewers, with the filters the reviews module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Reviewer)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def active(self) -> Self:
        return self.matching(Among("state", ACTIVE))

    def idle(self) -> Self:
        return self.filter(state=ReviewerState.IDLE)
