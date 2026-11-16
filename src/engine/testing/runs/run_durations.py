import json
import math
import os
import sys
from pathlib import Path, PurePosixPath

from engine.file.file_access import FileAccess
from engine.module.code_fingerprint import CORE_FOLDER

DURATIONS_FILE_VARIABLE = "JOURNAL_FULL_RUN_DURATIONS"
DURATIONS_FILE = Path(os.environ[DURATIONS_FILE_VARIABLE]) if DURATIONS_FILE_VARIABLE in os.environ else CORE_FOLDER.parent.parent / ".journal" / "runtime" / "full-test-durations.json"
SLOWEST_TESTS = 40


class RunDurations:
    """The seconds each test of one run took, setup and teardown included, by test id. The newest full run
    writes them to a file in the checkout's journal folder; `python -m engine.testing.runs.run_durations`
    lists the slowest tests and the folders by total seconds. It is a record, never an assertion on time."""

    def __init__(self, seconds: dict[str, float] | None = None) -> None:
        self.seconds: dict[str, float] = seconds if seconds is not None else {}

    @staticmethod
    def read(file: Path = DURATIONS_FILE) -> "RunDurations":
        if not FileAccess.is_file(file):
            return RunDurations()
        return RunDurations(json.loads(FileAccess.read(file)))

    def add(self, test_id: str, seconds: float) -> None:
        self.seconds[test_id] = self.seconds.get(test_id, 0.0) + seconds

    def write(self, file: Path = DURATIONS_FILE) -> None:
        if FileAccess.is_dir(file.parent):
            FileAccess.write(file, json.dumps(self.seconds, sort_keys=True))

    # the tests in the order a run takes them: a test with no record first, so a new test fails early, then the
    # longest first, so no slow file ends the run late; equal seconds keep the order they were collected in
    def run_order(self, test_ids: list[str]) -> list[str]:
        return sorted(test_ids, key=lambda test_id: -self.seconds.get(test_id, math.inf))

    def slowest_lines(self, count: int = SLOWEST_TESTS) -> list[str]:
        slowest = sorted(self.seconds.items(), key=lambda item: item[1], reverse=True)[:count]
        return [f"{seconds:8.2f}  {test_id}" for test_id, seconds in slowest]

    def folder_lines(self) -> list[str]:
        totals: dict[str, float] = {}
        for test_id, seconds in self.seconds.items():
            folder = str(PurePosixPath(test_id.split("::")[0]).parent)
            totals[folder] = totals.get(folder, 0.0) + seconds
        return [f"{seconds:8.2f}  {folder}" for folder, seconds in sorted(totals.items(), key=lambda item: item[1], reverse=True)]

    def report(self) -> str:
        slowest, folders = "\n".join(self.slowest_lines()), "\n".join(self.folder_lines())
        return f"""the {SLOWEST_TESTS} slowest tests, in seconds:
{slowest}

folders by total seconds:
{folders}"""


def main() -> int:
    durations = RunDurations.read()
    if not durations.seconds:
        sys.stdout.write(f"no full run has kept its durations in {DURATIONS_FILE}\n")
        return 1
    sys.stdout.write(durations.report() + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
