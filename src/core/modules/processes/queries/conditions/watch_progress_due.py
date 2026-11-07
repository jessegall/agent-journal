from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class WatchProgressDue:
    """Matches watches awaiting their first notice or another progress step."""

    step_percent: int

    def statement(self) -> Statement:
        return Statement("(given_percent < 0 OR EXISTS (SELECT 1 FROM processes WHERE processes.id = watches.process_id "
                         "AND processes.progress - processes.progress % ? > watches.given_percent))", [self.step_percent])
