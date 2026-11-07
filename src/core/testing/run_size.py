from core.base.file_access import FileAccess
import re
from collections.abc import Iterable, Iterator
from pathlib import Path

TEST_NAME_SEPARATOR = "::"
TEST_FUNCTION = re.compile(r"^\s*(?:async\s+)?def test_", re.MULTILINE)


class RunSize:
    """Counts the tests a run names from its files, without importing them, and stops counting at the limit, to
    choose how many test runners it starts: one for every started block of tests, up to the most, since starting
    a runner costs more time than it saves on a few tests."""

    def __init__(self, targets: Iterable[str], limit: int) -> None:
        self.targets, self.limit = tuple(targets), limit

    def workers(self, tests_per_worker: int, most_workers: int) -> int:
        if not self.targets:
            return most_workers
        return max(1, min(most_workers, -(-self.counted() // tests_per_worker)))

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
