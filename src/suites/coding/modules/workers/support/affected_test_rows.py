from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState


class AffectedTestRows:
    """Shares queued test selections until they change."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def queued(self) -> tuple[AffectedTest, ...]:
        return self.kept.read("affected_tests", lambda: tuple(self.queries.query(AffectedTest).filter(state=AffectedTestState.QUEUED).oldest().all_rows()),
                              "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")

    def save(self, row: AffectedTest) -> None:
        self.kept.update("affected_tests", lambda rows: tuple(sorted([item for item in rows if item.id != row.id] +
                         ([row] if row.state is AffectedTestState.QUEUED else []), key=lambda item: item.id)),
                         "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")

    def remove(self, row: AffectedTest) -> None:
        self.kept.update("affected_tests", lambda rows: tuple(item for item in rows if item.id != row.id),
                         "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")
