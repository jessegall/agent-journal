from collections.abc import Generator
from contextlib import contextmanager

from core.base.journal_home import JournalHome
from core.base.server_restart_state import ServerRestartState

TESTS_RUNNING_FILE = "tests-running"


class PerformanceState:
    """The shared lifecycle check for capturing and reporting development costs."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.restart = ServerRestartState(home)
        self.tests = home.costly_hooks_log.parent / TESTS_RUNNING_FILE
        self.starting = home.folder / "performance-starting"
        self.reloading = home.folder / "performance-reloading"

    @property
    def can_measure(self) -> bool:
        return not (self.starting.exists() or (self.home.folder / "server-starting").exists()
                    or self.reloading.exists() or self.tests.exists()
                    or self.restart.is_restarting or self.restart.is_updating)

    def begin_start(self) -> None:
        self.starting.write_text("0")

    def keep_boot_event(self, event_id: int) -> None:
        self.starting.write_text(str(event_id))

    def boot_event(self) -> int:
        try:
            text = self.starting.read_text()
        except FileNotFoundError:
            return 0
        return int(text) if text else 0

    def finish_start(self) -> None:
        self.starting.unlink(missing_ok=True)

    def keep_tests_running(self, is_running: bool) -> None:
        if not is_running:
            self.tests.unlink(missing_ok=True)
            return
        self.tests.parent.mkdir(parents=True, exist_ok=True)
        self.tests.touch()

    @contextmanager
    def reload(self) -> Generator[None]:
        self.reloading.touch()
        try:
            yield
        finally:
            self.reloading.unlink(missing_ok=True)
