from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.select import Select


@dataclass(frozen=True)
class TaskTagMatch:
    """Matches task IDs carrying one tag word."""

    word: str

    def statement(self) -> Statement:
        return SubqueryMatch("id", Select("task_tags").matching(Equal("word", self.word)).column("task_id")).statement()
