from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.query.query import Query
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.queries.replaced_rows import replaced_rows

QUEUED_TESTS_REASON = "the queue of affected tests runs every queued one in turn"


class AffectedTestRows:
    """Shares queued test selections until they change."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def queued(self) -> tuple[AffectedTest, ...]:
        queued = self.queued_rows()
        return self.kept.read(queued, lambda: tuple(queued.every_row(QUEUED_TESTS_REASON)), name="workers.queued_affected_tests")

    def queued_rows(self) -> Query[AffectedTest]:
        return self.queries.query(AffectedTest).filter(state=AffectedTestState.QUEUED).oldest()

    def save(self, row: AffectedTest) -> None:
        def with_row(rows: tuple[AffectedTest, ...]) -> tuple[AffectedTest, ...]:
            return replaced_rows(rows, row.id, [row] if row.state is AffectedTestState.QUEUED else [])

        self.kept.update(self.queued_rows(), with_row, name="workers.queued_affected_tests")

    def remove(self, row: AffectedTest) -> None:
        def without_row(rows: tuple[AffectedTest, ...]) -> tuple[AffectedTest, ...]:
            return replaced_rows(rows, row.id, [])

        self.kept.update(self.queued_rows(), without_row, name="workers.queued_affected_tests")
