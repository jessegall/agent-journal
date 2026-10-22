from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class QuestionPosed(RowEvent):
    """A question was asked, for the user to answer."""

    question_id: int
