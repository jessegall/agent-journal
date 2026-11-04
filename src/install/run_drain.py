import os
import time

from core.base.journal_home import JournalHome
from core.modules.processes.support.output_folder import OutputFolder
from server.server_files import ServerFiles

RUN_DRAIN_LIMIT_SECONDS = 60
POLL_SECONDS = 1.0
PROCESS_VARIABLE = "JOURNAL_PROCESS"


class RunDrain:
    """Waits before a change of the journal's code until no run is going: the run lock makes new runs wait in their
    scripts, and a run that started this change does not count. Past the limit the change goes ahead."""

    def __init__(self, home: JournalHome, limit_seconds: float = RUN_DRAIN_LIMIT_SECONDS, poll_seconds: float = POLL_SECONDS) -> None:
        self.outputs, self.files, self.limit_seconds, self.poll_seconds = OutputFolder(home), ServerFiles(home), limit_seconds, poll_seconds

    def wait(self) -> None:
        self.files.mark_run_lock()
        deadline = time.monotonic() + self.limit_seconds
        while self.running_folders() and time.monotonic() < deadline:
            time.sleep(self.poll_seconds)

    def running_folders(self) -> tuple[int, ...]:
        return tuple(process_id for process_id in self.outputs.running_ids() if str(process_id) != os.environ.get(PROCESS_VARIABLE))
