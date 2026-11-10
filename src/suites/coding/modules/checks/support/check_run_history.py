from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass

from engine.change.logged_event import LoggedEvent
from suites.coding.modules.checks.support.check_run_record import CheckRunRecord

CHECK_RUN_FIELD = "last_run_at"
PASSED_FIELD = "last_passed"
OUTPUT_FIELD = "last_output"
RUNS_SHOWN = 50


@dataclass(frozen=True)
class CheckRunHistory:
    """A check's runs, newest first, read from the events that recorded them; an event names only what
    changed."""

    records: Sequence[CheckRunRecord]

    @classmethod
    def built(cls, events: Iterable[LoggedEvent]) -> "CheckRunHistory":
        records: list[CheckRunRecord] = []
        passed, output = False, ""
        for event in events:
            passed = bool(event.data[PASSED_FIELD][1]) if PASSED_FIELD in event.data else passed
            output = str(event.data[OUTPUT_FIELD][1]) if OUTPUT_FIELD in event.data else output
            if CHECK_RUN_FIELD in event.data and event.data[CHECK_RUN_FIELD][1] is not None:
                records.append(CheckRunRecord(str(event.data[CHECK_RUN_FIELD][1]), passed, output))
        return cls(tuple(reversed(records[-RUNS_SHOWN:])))

    def lines(self) -> Sequence[str]:
        return [f"{record.run_at}  {'passed' if record.passed else 'failed'}" for record in self.records] or ["no runs yet"]

    def json(self) -> Mapping[str, object]:
        return {"rows": [{"run_at": record.run_at, "passed": record.passed, "output": record.output} for record in self.records]}
