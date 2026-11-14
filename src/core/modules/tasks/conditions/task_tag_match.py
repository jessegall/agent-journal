from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select


@dataclass(frozen=True)
class TaskTagMatch:
    """Matches task IDs carrying one tag word."""

    word: str

    def statement(self) -> Statement:
        return SubqueryMatch("id", Select("task_tags").matching(Equal("word", self.word)).column("task_id")).statement()
