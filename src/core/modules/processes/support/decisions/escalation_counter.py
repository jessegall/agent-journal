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
READ_KEY_COUNT = 100


class EscalationCounter:
    """Counts the ended runs of one command that lacked a good reader since the count was last reset: by a
    reader of the command saved or changed after a run, a mark that its output cannot be read, or a skip."""

    def __init__(self, decisions: ReadingDecisionQuery, readers: ReaderRows, resets: EscalationResets) -> None:
        self.decisions, self.readers, self.resets = decisions, readers, resets

    # The count of each command, from one read of the newest ended runs of all of them: up to RUNS_READ runs a command,
    # so a command that runs far less often than the others may count fewer runs than it had.
    def runs_without_change(self, command_keys: Sequence[str]) -> dict[str, int]:
        keys = tuple(dict.fromkeys(command_keys))
        ended = [row for start in range(0, len(keys), READ_KEY_COUNT) for row in self.ended_runs(keys[start:start + READ_KEY_COUNT])]
        rows = {key: [row for row in ended if row.command_key == key][:RUNS_READ] for key in keys}
        flagged = self.resets.last_flagged_among(keys)
        return {key: self.counted_runs(key, rows[key], flagged[key]) for key in keys}

    def ended_runs(self, keys: Sequence[str]) -> list[ReadingDecisionRow]:
        return self.decisions.matching(Among("command_key", tuple(keys))).filter(moment=ReadingMoment.END).descending("decided_at", "id").take(RUNS_READ * len(keys))

    def counted_runs(self, command_key: str, ended: Sequence[ReadingDecisionRow], flagged_at: Timestamp | None) -> int:
        changed_at = self.reader_changed_at(command_key)
        return self.counted([KeyRun(row.state, self.is_reset_after(command_key, row.decided_at, changed_at, flagged_at)) for row in ended])

    def reader_changed_at(self, command_key: str) -> Timestamp | None:
        changes = [reader.update_timestamp() for reader in self.readers.all() if ReaderSelection.matches(reader.commands, command_key)]
        return max(changes) if changes else None

    def is_reset_after(self, command_key: str, decided_at: Timestamp, changed_at: Timestamp | None, flagged_at: Timestamp | None) -> bool:
        reader_changed = changed_at is not None and changed_at > decided_at
        flagged = flagged_at is not None and flagged_at > decided_at
        return reader_changed or flagged or self.resets.skipped_after(command_key, decided_at)

    @staticmethod
    def counted(runs_newest_first: Sequence[KeyRun]) -> int:
        unreset = takewhile(lambda run: not run.reset_after, runs_newest_first)
        return sum(1 for run in unreset if run.state.is_readerless)
