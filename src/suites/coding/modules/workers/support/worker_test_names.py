from core.base.driver.part import Part
from core.modules.processes.support.background_commands import JOURNAL
import shlex
from collections.abc import Sequence

from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worker_test_command import WorkerTestCommand

CALL = "journal worker test <name> <test files>"


WORKER_TEST_ARGUMENTS = ("worker", "test")


class WorkerTestNames:
    """The test commands a worker was given: the names it has and the line a name runs."""

    @staticmethod
    def is_worker_test(part: Part) -> bool:
        return part.program == JOURNAL and tuple(part.arguments[:2]) == WORKER_TEST_ARGUMENTS

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def rows(self, worker_id: int) -> tuple[WorkerTestCommand, ...]:
        return self.kept.scoped_current(lambda: tuple(self.queries.query(WorkerTestCommand).filter(worker_id=worker_id).oldest().all_rows()), name=f"workers.test_names:{worker_id}")

    def names_text(self, worker_id: int) -> str:
        return ", ".join(sorted(row.name for row in self.rows(worker_id)))

    def line(self, worker_id: int, name: str, test_arguments: Sequence[str]) -> str:
        rows = self.rows(worker_id)
        if not rows:
            raise Refusal("you have no test command", "the main agent gives them at dispatch")
        bound = next((row.command for row in rows if row.name == name), None)
        if bound is None:
            raise Refusal(f"{name} is no test command of yours; you have: {', '.join(sorted(row.name for row in rows))}", CALL)
        return " ".join([bound, *(shlex.quote(argument) for argument in test_arguments)])

    def known_line(self, worker_id: int, name: str, test_arguments: Sequence[str]) -> str | None:
        bound = next((row.command for row in self.rows(worker_id) if row.name == name), None)
        return None if bound is None else " ".join([bound, *(shlex.quote(argument) for argument in test_arguments)])
