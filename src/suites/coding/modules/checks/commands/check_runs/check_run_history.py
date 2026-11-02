from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass

from core.base.change.logged_event import LoggedEvent

RUN_FIELD = "last_run_at"
PASSED_FIELD = "last_passed"
OUTPUT_FIELD = "last_output"
RUNS_SHOWN = 50


@dataclass(frozen=True)
class CheckRunRecord:
    """One run of a check: when it ran, whether it passed and what it printed."""

    run_at: str
    passed: bool
    output: str


@dataclass(frozen=True)
class CheckRunHistory:
    """A check's runs, newest first, read from the events that recorded them; an event names only what changed."""

    records: Sequence[CheckRunRecord]

    @classmethod
    def built(cls, events: Iterable[LoggedEvent]) -> "CheckRunHistory":
        records: list[CheckRunRecord] = []
        passed, output = False, ""
        for event in events:
            passed = bool(event.data[PASSED_FIELD][1]) if PASSED_FIELD in event.data else passed
            output = str(event.data[OUTPUT_FIELD][1]) if OUTPUT_FIELD in event.data else output
            if RUN_FIELD in event.data and event.data[RUN_FIELD][1] is not None:
                records.append(CheckRunRecord(str(event.data[RUN_FIELD][1]), passed, output))
        return cls(tuple(reversed(records[-RUNS_SHOWN:])))

    def lines(self) -> Sequence[str]:
        return [f"{record.run_at}  {'passed' if record.passed else 'failed'}" for record in self.records] or ["no runs yet"]

    def json(self) -> Mapping[str, object]:
        return {"rows": [{"run_at": record.run_at, "passed": record.passed, "output": record.output} for record in self.records]}
