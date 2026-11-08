from core.base.file_access import FileAccess
import re
from collections.abc import Iterable, Iterator
from pathlib import Path

TEST_NAME_SEPARATOR = "::"
HEAVY_TESTS = 50
FULL_SUITE = "tests"
TEST_FUNCTION = re.compile(r"^\s*(?:async\s+)?def test_", re.MULTILINE)


class RunSize:
    """Counts the tests a run names from its files, without importing them, and stops counting at the limit,
    to choose how many test runners it starts: one for a few tests, since starting a runner costs more time
    than it saves on them, the most for a large run or the whole suite, and the usual number between."""

    def __init__(self, targets: Iterable[str], limit: int) -> None:
        self.targets, self.limit = tuple(targets), limit

    def is_full_suite(self) -> bool:
        return all(target.rstrip("/") == FULL_SUITE for target in self.targets)

    def is_heavy(self) -> bool:
        if not self.targets or self.is_full_suite():
            return True
        is_single_test = len(self.targets) == 1 and (TEST_NAME_SEPARATOR in self.targets[0] or Path(self.targets[0]).is_file())
        return not is_single_test and self.limited_count(HEAVY_TESTS) >= HEAVY_TESTS

    def limited_count(self, limit: int) -> int:
        return RunSize(self.targets, limit).counted()

    def runner_count(self, one_runner_below: int, runners: int, most_runners_from: int, most_runners: int) -> int:
        if not self.targets:
            return most_runners
        count = self.counted()
        if count < one_runner_below:
            return 1
        return most_runners if count >= most_runners_from else runners

    def counted(self) -> int:
        count = 0
        for tests in self.test_counts():
            count += tests
            if count >= self.limit:
                break
        return count

    def test_counts(self) -> Iterator[int]:
        for target in self.targets:
            if TEST_NAME_SEPARATOR in target:
                yield 1
            else:
                yield from (len(TEST_FUNCTION.findall(FileAccess.shared().read(path, errors="replace"))) for path in self.python_files(Path(target)))

    @staticmethod
    def python_files(target: Path) -> Iterable[Path]:
        if target.is_dir():
            return target.rglob("*.py")
        return [target] if target.is_file() else []
