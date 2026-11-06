from core.base.file_access import FileAccess
import os
import time

from core.base.journal_home import JournalHome

MAINTENANCE_FILE = "maintenance"
MAINTENANCE_LIMIT_SECONDS = 600
RUN_LOCK_LIMIT_SECONDS = 600
RESTART_LIMIT_SECONDS = 120


class ServerRestartState:
    """Whether a restart or an install holds the server, from the files they leave, by the rules of the CLI and
    the hook: a restart file counts under two minutes old, a run lock file under ten minutes old, a maintenance
    file while the process it names runs and under ten minutes old, so a file left by a process that died holds
    nothing for long."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def is_restarting(self) -> bool:
        restart_file = self.home.restart_mark
        return restart_file.is_file() and time.time() - restart_file.stat().st_mtime < RESTART_LIMIT_SECONDS

    @property
    def is_updating(self) -> bool:
        maintenance_file = self.home.folder / MAINTENANCE_FILE
        if not maintenance_file.is_file() or time.time() - maintenance_file.stat().st_mtime >= MAINTENANCE_LIMIT_SECONDS:
            return False
        text = FileAccess.shared().read(maintenance_file).strip()
        return not text.isdigit() or self.is_running(int(text))

    @property
    def is_waiting_for_runs(self) -> bool:
        run_lock = self.home.run_lock
        return run_lock.is_file() and time.time() - run_lock.stat().st_mtime < RUN_LOCK_LIMIT_SECONDS

    @staticmethod
    def is_running(pid: int) -> bool:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True
