import json
import os
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from statistics import median

from core.base.file_access import FileAccess
from core.base.module.code_fingerprint import CORE_FOLDER

RECORD_FILE_VARIABLE = "JOURNAL_FULL_RUN_RECORD"
RECORD_FILE = Path(os.environ[RECORD_FILE_VARIABLE]) if RECORD_FILE_VARIABLE in os.environ else CORE_FOLDER.parent.parent / ".journal" / "runtime" / "full-test-runs.jsonl"
KEPT_RUNS = 50
COMPARED_RUNS = 5
ALLOWED_GROWTH = 0.3


@dataclass(frozen=True)
class FullRunRecord:
    """One run of the whole suite: how many tests it ran, how many failed, how long it took on the clock and
    how many processor seconds the test runners spent together, kept as a line in the checkout's journal
    folder so a check can warn when the time per test grows. A line from before the processor seconds were
    kept reads with none."""

    tests: int
    failed: int
    seconds: float
    cpu_seconds: float = 0.0
    finished_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @property
    def average_test_seconds(self) -> float:
        return self.seconds / max(self.tests, 1)

    def summary_line(self) -> str:
        return f"full run: {self.seconds:.1f} wall seconds, {self.cpu_seconds:.1f} cpu seconds in the test runners"

    def write(self, file: Path = RECORD_FILE) -> None:
        if not file.parent.is_dir():
            return
        kept = FullRunRecords.read(file).records[-(KEPT_RUNS - 1):]
        FileAccess.shared().write(file, "".join(json.dumps(asdict(record)) + "\n" for record in [*kept, self]))


@dataclass(frozen=True)
class FullRunRecords:
    """The recorded runs of the whole suite, oldest first, and whether the newest took longer per test than
    the runs before it."""

    records: list[FullRunRecord]

    @staticmethod
    def read(file: Path = RECORD_FILE) -> "FullRunRecords":
        if not file.is_file():
            return FullRunRecords([])
        lines = FileAccess.shared().read(file).splitlines()
        return FullRunRecords([FullRunRecord(**json.loads(line)) for line in lines if line.strip()])

    def growth(self) -> str:
        if len(self.records) < 2:
            return ""
        newest = self.records[-1]
        usual = median(record.average_test_seconds for record in self.records[-COMPARED_RUNS - 1:-1])
        if newest.average_test_seconds <= usual * (1 + ALLOWED_GROWTH):
            return ""
        return (f"the last full run took {newest.average_test_seconds:.3f} seconds per test over {newest.tests} tests, against "
                f"{usual:.3f} in the runs before it: find what made each test slower")


def main() -> int:
    growth = FullRunRecords.read().growth()
    if not growth:
        return 0
    print(growth)
    return 1


if __name__ == "__main__":
    sys.exit(main())
