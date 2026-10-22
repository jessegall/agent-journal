from journal.features.faults.support.test_run_files import TestRunFiles
from journal.features.seed import Seed


class StaleTestRunFiles(Seed):
    """At boot, the files that say a test run is on are removed when the run's process is gone, so a run cut off by its time limit leaves nothing behind."""

    def __init__(self, test_runs: TestRunFiles) -> None:
        self.test_runs = test_runs

    def run(self) -> None:
        for run_file in self.test_runs.files():
            if not self.test_runs.is_running(run_file):
                run_file.unlink(missing_ok=True)
