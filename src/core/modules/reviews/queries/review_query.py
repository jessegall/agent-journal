from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.query import Query
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.review import Review

UNFINISHED = (ReviewState.QUEUED, ReviewState.REVIEWING)


class ReviewQuery(Query[Review]):
    """Reads reviews, with the filters the reviews module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Review)

    def subject(self, subject_model: str, subject_id: int) -> Self:
        return self.filter(subject_model=subject_model, subject_id=subject_id)

    def unfinished(self) -> Self:
        return self.matching(Among("state", UNFINISHED))
