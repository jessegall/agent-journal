from collections.abc import Callable, Sequence

from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.command_run_count import CommandRunCount

COUNTING_COMMANDS_READ = 1000
COUNTING_REASON = "the commands still counting runs without a reader, which a reader or a mark may set back; read by their count's index"


class CommandRunCounts:
    """Keeps, for each command, the one count of its runs that ended without a good reader: a run end adds one, a
    reset sets it back to zero, and a command that never ended such a run has counted none."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def runs_without_reader(self, command_keys: Sequence[str]) -> dict[str, int]:
        keys = tuple(dict.fromkeys(command_keys))
        stored = {row.command_key: row.runs_without_reader for row in self.queries.query(CommandRunCount).matching(Among("command_key", keys)).every_row("one count row for each command a run names")}
        return {key: stored.get(key, 0) for key in keys}

    def add_run(self, command_key: str, context: Context) -> None:
        stored = self.queries.query(CommandRunCount).filter(command_key=command_key).first()
        if stored is None:
            self.repository.save(CommandRunCount(command_key=command_key, runs_without_reader=1), context)
            return
        self.repository.update(stored, context, runs_without_reader=stored.runs_without_reader + 1)

    def reset(self, covers: Callable[[str], bool], context: Context) -> None:
        counting = self.queries.query(CommandRunCount).matching(Greater("runs_without_reader", 0)).descending("runs_without_reader").limit(COUNTING_COMMANDS_READ, COUNTING_REASON).get()
        for stored in [row for row in counting if covers(row.command_key)]:
            self.repository.update(stored, context, runs_without_reader=0)
