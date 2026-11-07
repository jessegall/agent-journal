import subprocess
import time

from core.base.journal_home import JournalHome
from install.update_steps import UpdateSteps

STEP_LIMIT_SECONDS = 90


class ChatUpdateSteps(UpdateSteps):
    """Moves the chat mark of one server update to a step with `journal update step`, so the chat shows the update
    go on. A step the journal cannot show, such as a server too old to know the command, is left out and the
    update goes on."""

    def __init__(self, home: JournalHome) -> None:
        self.home, self.run = home, str(time.time_ns())

    def record(self, step: str, detail: str = "") -> None:
        journal = self.home.folder / "bin" / "journal"
        if not journal.is_file():
            return
        try:
            subprocess.run([str(journal), "update", "step", self.run, step, detail], capture_output=True, timeout=STEP_LIMIT_SECONDS, check=False)
        except subprocess.TimeoutExpired:
            return
