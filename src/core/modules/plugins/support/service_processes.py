from core.base.child_process import ChildProcess

STOP_LIMIT_SECONDS = 5


class ServiceProcesses:
    """The plugin services this journal started, by plugin and service name, and the ones whose condition kept
    them from running here."""

    def __init__(self) -> None:
        self.running: dict[tuple[str, str], ChildProcess] = {}
        self.skipped: set[tuple[str, str]] = set()

    def close(self) -> None:
        for process in self.running.values():
            process.stop(STOP_LIMIT_SECONDS)
        self.running.clear()
