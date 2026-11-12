from collections.abc import Sequence
from itertools import takewhile

from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from engine.query.conditions.among import Among
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.decisions.escalation_resets import EscalationResets
from core.modules.processes.support.decisions.key_run import KeyRun

RUNS_READ = 10


class EscalationCounter:
    """Counts the ended runs of one command that lacked a good reader since the count was last reset: by a
    reader of the command saved or changed after a run, a mark that its output cannot be read, or a skip."""

    def __init__(self, decisions: ReadingDecisionQuery, readers: ReaderRows, resets: EscalationResets) -> None:
        self.decisions, self.readers, self.resets = decisions, readers, resets

    def runs_without_change(self, command_keys: Sequence[str]) -> dict[str, int]:
        keys = tuple(dict.fromkeys(command_keys))
        ended = self.decisions.matching(Among("command_key", keys)).filter(moment=ReadingMoment.END).descending("decided_at", "id").limited(RUNS_READ * len(keys))
        rows = {key: [row for row in ended if row.command_key == key][:RUNS_READ] for key in keys}
        marked = self.resets.last_marked_among(keys)
        return {key: self.counted_runs(key, rows[key], marked[key]) for key in keys}

    def counted_runs(self, command_key: str, ended: Sequence[ReadingDecisionRow], marked_at: Timestamp | None) -> int:
        changed_at = self.reader_changed_at(command_key)
        return self.counted([KeyRun(row.state, self.is_reset_after(command_key, row.decided_at, changed_at, marked_at)) for row in ended])

    def reader_changed_at(self, command_key: str) -> Timestamp | None:
        changes = [reader.update_timestamp() for reader in self.readers.all() if ReaderSelection.matches(reader.commands, command_key)]
        return max(changes) if changes else None

    def is_reset_after(self, command_key: str, decided_at: Timestamp, changed_at: Timestamp | None, marked_at: Timestamp | None) -> bool:
        reader_changed = changed_at is not None and changed_at > decided_at
        marked = marked_at is not None and marked_at > decided_at
        return reader_changed or marked or self.resets.skipped_since(command_key, decided_at)

    @staticmethod
    def counted(runs_newest_first: Sequence[KeyRun]) -> int:
        unreset = takewhile(lambda run: not run.reset_after, runs_newest_first)
        return sum(1 for run in unreset if run.state.lacks_a_reader)
