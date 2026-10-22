from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class QuestionAnswered(RowEvent):
    """A question was answered."""

    question_id: int
