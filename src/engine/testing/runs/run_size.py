from engine.text.run_target import RunTarget
from engine.file.file_access import FileAccess
import re
from collections.abc import Iterable, Iterator
from pathlib import Path

FULL_SUITE = "tests"
UNIT_FOLDER = "unit"
TEST_FUNCTION = re.compile(r"^\s*(?:async\s+)?def test_", re.MULTILINE)


class RunSize:
    """Counts the tests a run names from its files, without importing them, and stops counting at the limit,
    to choose how many test runners it starts: one for a few tests, since starting a runner costs more time
    than it saves on them, the most for a large run or the whole suite, and the usual number between."""

    def __init__(self, targets: Iterable[str], limit: int) -> None:
        self.targets, self.limit = tuple(targets), limit

    def is_full_suite(self) -> bool:
        return all(target.rstrip("/") == FULL_SUITE for target in self.targets)

    def reaches_stories(self) -> bool:
        return not self.targets or any(UNIT_FOLDER not in Path(target).parts for target in self.targets)

    def runner_count(self, single_runner_limit: int, runners: int, highest_count_start: int, most_runners: int) -> int:
        if not self.targets:
            return most_runners
        count = self.counted()
        if count < single_runner_limit:
            return 1
        return most_runners if count >= highest_count_start else runners

    def counted(self) -> int:
        count = 0
        for tests in self.test_counts():
            count += tests
            if count >= self.limit:
                break
        return count

    def test_counts(self) -> Iterator[int]:
        for target in self.targets:
            if RunTarget(target).is_single_test:
                yield 1
            else:
                yield from (len(TEST_FUNCTION.findall(FileAccess.read(path, errors="replace"))) for path in self.python_files(Path(target)))

    @staticmethod
    def python_files(target: Path) -> Iterable[Path]:
        if FileAccess.is_dir(target):
            return FileAccess.rglob(target, "*.py")
        return [target] if FileAccess.is_file(target) else []
