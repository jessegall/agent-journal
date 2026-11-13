from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
from collections.abc import Generator
from contextlib import contextmanager

from engine.time.clock import Clock
from engine.journal.journal_home import JournalHome
from engine.hosting.server_restart_state import ServerRestartState

TESTS_RUNNING_FILE = "tests-running"


class PerformanceState:
    """The shared lifecycle check for capturing and reporting development costs."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.restart = ServerRestartState(home, Clock())
        self.tests = home.system_log.parent / TESTS_RUNNING_FILE
        self.starting = home.folder / "performance-starting"
        self.reloading = home.folder / "performance-reloading"
        self.boot_events: dict[FileVersion, int] = {}

    @property
    def can_measure(self) -> bool:
        return not (FileAccess.exists(self.starting) or FileAccess.exists(self.home.folder / "server-starting")
                    or FileAccess.exists(self.reloading) or FileAccess.exists(self.tests)
                    or self.restart.is_restarting or self.restart.is_updating)

    def begin_start(self) -> None:
        FileAccess.write(self.starting, "0")
        self.boot_events.clear()

    def keep_boot_event(self, event_id: int) -> None:
        FileAccess.write(self.starting, str(event_id))
        self.boot_events.clear()

    def boot_event(self) -> int:
        try:
            version = FileAccess.version(self.starting)
        except FileNotFoundError:
            return 0
        if version not in self.boot_events:
            text = FileAccess.read(self.starting)
            self.boot_events = {version: int(text) if text else 0}
        return self.boot_events[version]

    def finish_start(self) -> None:
        FileAccess.unlink(self.starting, missing_ok=True)
        self.boot_events.clear()

    def keep_tests_running(self, is_running: bool) -> None:
        if not is_running:
            FileAccess.unlink(self.tests, missing_ok=True)
            return
        FileAccess.mkdir(self.tests.parent, parents=True, exist_ok=True)
        FileAccess.update_timestamp(self.tests)

    @contextmanager
    def reload(self) -> Generator[None]:
        FileAccess.update_timestamp(self.reloading)
        try:
            yield
        finally:
            FileAccess.unlink(self.reloading, missing_ok=True)
