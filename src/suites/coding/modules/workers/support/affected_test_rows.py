from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.support.replaced_rows import replaced_rows


class AffectedTestRows:
    """Shares queued test selections until they change."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def queued(self) -> tuple[AffectedTest, ...]:
        return self.kept.read("affected_tests", lambda: tuple(self.queries.query(AffectedTest).filter(state=AffectedTestState.QUEUED).oldest().all_rows()),
                              "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")

    def save(self, row: AffectedTest) -> None:
        def with_row(rows: tuple[AffectedTest, ...]) -> tuple[AffectedTest, ...]:
            return replaced_rows(rows, row.id, [row] if row.state is AffectedTestState.QUEUED else [])

        self.kept.update("affected_tests", with_row, "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")

    def remove(self, row: AffectedTest) -> None:
        def without_row(rows: tuple[AffectedTest, ...]) -> tuple[AffectedTest, ...]:
            return replaced_rows(rows, row.id, [])

        self.kept.update("affected_tests", without_row, "state = ?", [AffectedTestState.QUEUED], name="workers.queued_affected_tests")
