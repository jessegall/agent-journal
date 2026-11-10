import json
import os
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from statistics import median

from engine.file.file_access import FileAccess
from engine.module.code_fingerprint import CORE_FOLDER
from core.testing.full_run_record import FullRunRecord

RECORD_FILE_VARIABLE = "JOURNAL_FULL_RUN_RECORD"
RECORD_FILE = Path(os.environ[RECORD_FILE_VARIABLE]) if RECORD_FILE_VARIABLE in os.environ else CORE_FOLDER.parent.parent / ".journal" / "runtime" / "full-test-runs.jsonl"
KEPT_RUNS = 50
COMPARED_RUNS = 5
ALLOWED_GROWTH = 0.3


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

    @staticmethod
    def add(record: FullRunRecord, file: Path = RECORD_FILE) -> None:
        if not file.parent.is_dir():
            return
        kept = FullRunRecords.read(file).records[-(KEPT_RUNS - 1):]
        FileAccess.shared().write(file, "".join(json.dumps(asdict(kept_record)) + "\n" for kept_record in [*kept, record]))

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
