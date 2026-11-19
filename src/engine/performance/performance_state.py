from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
from collections.abc import Generator
from contextlib import contextmanager

from engine.time.clock import Clock
from engine.journal.journal_home import JournalHome
from engine.hosting.server_restart_state import ServerRestartState
from engine.performance.measure_answer import MeasureAnswer

TESTS_RUNNING_FILE = "tests-running"


class PerformanceState:
    """The shared lifecycle check for capturing and reporting development costs."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.clock = Clock()
        self.restart = ServerRestartState(home, self.clock)
        self.tests = home.system_log.parent / TESTS_RUNNING_FILE
        self.starting = home.folder / "performance-starting"
        self.reloading = home.folder / "performance-reloading"
        self.boot_events: dict[FileVersion, int] = {}

    # asked for every command and timed step, so the four marks of a start, reload or test run are looked at once a
    # second at most, and dropped when this state changes one; a restart or an update, which other processes mark,
    # is looked at each time
    @property
    def can_measure(self) -> bool:
        return (MeasureAnswer.shared(self.home).answer(self.clock.unix_seconds(), self.unmarked_now)
                and not (self.restart.is_restarting or self.restart.is_updating))

    def unmarked_now(self) -> bool:
        return not (FileAccess.exists(self.starting) or FileAccess.exists(self.home.folder / "server-starting")
                    or FileAccess.exists(self.reloading) or FileAccess.exists(self.tests))

    def begin_start(self) -> None:
        FileAccess.write(self.starting, "0")
        self.boot_events.clear()
        self.forget_answer()

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
        self.forget_answer()

    def keep_tests_running(self, is_running: bool) -> None:
        self.forget_answer()
        if not is_running:
            FileAccess.unlink(self.tests, missing_ok=True)
            return
        FileAccess.mkdir(self.tests.parent, parents=True, exist_ok=True)
        FileAccess.update_timestamp(self.tests)

    @contextmanager
    def reload(self) -> Generator[None]:
        FileAccess.update_timestamp(self.reloading)
        self.forget_answer()
        try:
            yield
        finally:
            FileAccess.unlink(self.reloading, missing_ok=True)
            self.forget_answer()

    # a change made here applies at once; one made elsewhere, such as an update's restart files, within a second
    def forget_answer(self) -> None:
        MeasureAnswer.shared(self.home).forget()
