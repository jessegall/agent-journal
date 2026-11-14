from core.modules.processes.models.process import Process
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch


class RecordingTestLaunch(WorkerTestLaunch):
    """A worker test launch that starts nothing and keeps the number of each run it was asked to start, so a test
    sees which runs the journal queued without running them."""

    def __init__(self) -> None:
        self.started: list[int] = []

    def start(self, process: Process, line: str, session: str) -> None:
        self.started.append(process.id)

    def start_waited(self, process: Process, line: str, session: str) -> None:
        self.started.append(process.id)


# the runs the journal starts for a worker's tests from now on, recorded and not run; journal.unbind(WorkerTestLaunch)
# lets them run again
def recorded_test_launches(journal) -> list[int]:
    launch = RecordingTestLaunch()
    journal.bind(WorkerTestLaunch, launch)
    return launch.started
