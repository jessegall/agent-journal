from core.base.child_process import ChildProcess
from core.base.timestamp import Timestamp

STOP_LIMIT_SECONDS = 5


class ServiceProcesses:
    """The plugin services this journal started, by plugin and service name, and when the condition of each one
    that did not start was checked."""

    def __init__(self) -> None:
        self.running: dict[tuple[str, str], ChildProcess] = {}
        self.skipped: dict[tuple[str, str], Timestamp] = {}

    def close(self) -> None:
        for process in self.running.values():
            process.stop_group(STOP_LIMIT_SECONDS)
        self.running.clear()
