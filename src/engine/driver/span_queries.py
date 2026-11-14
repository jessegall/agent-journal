from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.database.kept_rows import KeptRows


class SpanQueries:
    """The query services a span reads."""

    def __init__(self, queries: Queries, rows: EventRows, kept: KeptRows) -> None:
        self.queries, self.rows, self.kept = queries, rows, kept
