from datetime import datetime

from journal.models.test_outcome import TestOutcome
from journal.models.test_turn import TestTurn
from journal.models.test_turn_state import TestTurnState
from journal.repositories.scoped_repository import ScopedRepository


class TestTurns(ScopedRepository[TestTurn]):
    __test__ = False

    model = TestTurn

    def waiting(self) -> list[TestTurn]:
        return self.selected_globally(self.query().filter(state=TestTurnState.WAITING).order("id"))

    def running(self) -> list[TestTurn]:
        return self.selected_globally(self.query().filter(state=TestTurnState.RUNNING).order("id"))

    def outcome_counts(self, since: datetime) -> dict[TestOutcome, int]:
        with self.connection.unlisted():
            rows = self.connection.all(*self.query().filter(state=TestTurnState.ENDED).filter_greater_equal("updated_at", since).grouped("outcome"))
        return {TestOutcome(row["value"]): row["total"] for row in rows}

    def output_turns(self, output: int) -> list[TestTurn]:
        return self.selected_globally(self.query().filter(output=output).order("id").limit(1))
