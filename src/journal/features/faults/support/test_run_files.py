import os
from pathlib import Path

from journal.config import Config

TEST_RUN_KEY = "tests.running"


class TestRunFiles:
    """The files a running test suite leaves in the journal's runtime folder, one per run named by its process: a run is on while its process lives."""

    __test__ = False

    def __init__(self, config: Config) -> None:
        self.runtime = config.home / "runtime"

    def files(self) -> list[Path]:
        return list(self.runtime.glob(f"{TEST_RUN_KEY}.*"))

    def is_testing(self) -> bool:
        return any(self.is_running(run_file) for run_file in self.files())

    @staticmethod
    def is_running(run_file: Path) -> bool:
        pid = run_file.suffix.lstrip(".")
        if not pid.isdigit():
            return False
        try:
            os.kill(int(pid), 0)
        except ProcessLookupError:
            return False
        return True
