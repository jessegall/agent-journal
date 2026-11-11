from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

import pytest

from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.decisions.escalation_counter import EscalationCounter
from core.modules.processes.support.decisions.escalation_resets import EscalationResets
from core.modules.processes.support.reading.key_run import KeyRun

START = datetime(2026, 11, 11, 12, 0, tzinfo=timezone.utc)


def minute(number: int) -> Timestamp:
    return Timestamp(START + timedelta(minutes=number))


@dataclass(frozen=True)
class DecisionSample:
    command_key: str
    state: ReaderState
    decided_at: Timestamp
    moment: ReadingMoment = ReadingMoment.END


@dataclass
class DecisionsSample:
    rows: list[DecisionSample]
    key: str = ""
    moment: ReadingMoment | None = None

    def for_command_key(self, key: str) -> "DecisionsSample":
        return DecisionsSample(self.rows, key)

    def filter(self, moment: ReadingMoment) -> "DecisionsSample":
        return DecisionsSample(self.rows, self.key, moment)

    def descending(self, *columns: str) -> "DecisionsSample":
        return self

    def limited(self, size: int) -> list[DecisionSample]:
        matching = [row for row in self.rows if row.command_key == self.key and row.moment is self.moment]
        return sorted(matching, key=lambda row: row.decided_at, reverse=True)[:size]


@dataclass
class ReadersSample:
    readers: tuple[Reader, ...] = ()

    def all(self) -> tuple[Reader, ...]:
        return self.readers


@dataclass
class ResetsSample(EscalationResets):
    marked_at: dict[str, Timestamp] = field(default_factory=dict)
    skipped_at: dict[str, Timestamp] = field(default_factory=dict)

    def last_marked_at(self, command_key: str) -> Timestamp | None:
        return self.marked_at.get(command_key)

    def skipped_since(self, command_key: str, timestamp: Timestamp) -> bool:
        return command_key in self.skipped_at and self.skipped_at[command_key] > timestamp


def missing_runs(key: str, count: int) -> list[DecisionSample]:
    return [DecisionSample(key, ReaderState.MISSING, minute(number)) for number in range(1, count + 1)]


def counter(rows: list[DecisionSample], readers: tuple[Reader, ...] = (), resets: EscalationResets | None = None) -> EscalationCounter:
    return EscalationCounter(DecisionsSample(rows), ReadersSample(readers), resets or ResetsSample())


@pytest.mark.parametrize("runs", [0, 1, 2, 3])
def test_each_ended_run_without_a_reader_counts_one(runs):
    assert counter(missing_runs("make build", runs)).runs_without_change("make build") == runs


def test_two_commands_do_not_count_against_each_other():
    counted = counter(missing_runs("make build", 2) + missing_runs("make test", 3))
    assert (counted.runs_without_change("make build"), counted.runs_without_change("make test")) == (2, 3)


def test_a_reader_saved_after_a_run_resets_the_count():
    reader = Reader(id=1, creator_id=7, name="builds", type=ReaderType.PATTERN, commands="make build*", updated_at=Timestamp(START + timedelta(minutes=2, seconds=30)))
    assert counter(missing_runs("make build", 3), (reader,)).runs_without_change("make build") == 1


def test_a_mark_that_the_output_cannot_be_read_resets_the_count():
    resets = ResetsSample(marked_at={"make build": Timestamp(START + timedelta(minutes=1, seconds=30))})
    assert counter(missing_runs("make build", 3), resets=resets).runs_without_change("make build") == 2


def test_a_skip_with_a_reason_resets_the_count():
    resets = ResetsSample(skipped_at={"make build": Timestamp(START + timedelta(minutes=3, seconds=30))})
    assert counter(missing_runs("make build", 3), resets=resets).runs_without_change("make build") == 0


def test_only_runs_that_lacked_a_good_reader_count():
    runs = [KeyRun(ReaderState.POOR, False), KeyRun(ReaderState.SUITABLE, False), KeyRun(ReaderState.DRAFTABLE, False), KeyRun(ReaderState.MISSING, True)]
    assert EscalationCounter.counted(runs) == 2
