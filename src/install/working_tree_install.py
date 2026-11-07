import sys
from pathlib import Path

from core.base.journal_home import JournalHome
from install.code_handover import CodeHandover
from install.code_replacement import CodeReplacement
from install.run_drain import RunDrain
from install.chat_update_steps import ChatUpdateSteps

OLD_SERVER_STATUS = 404


class WorkingTreeInstall(CodeHandover):
    """What `journal server update` runs: a project's own source tree goes into its journal by a hand-over once
    no run is going; a running server too old to hand over is stopped as before, and the next command starts
    the new code."""

    def __init__(self, home: JournalHome) -> None:
        super().__init__(home, ChatUpdateSteps(home))

    def run(self, source: Path) -> float:
        RunDrain(self.home).wait()
        try:
            return super().run(source)
        finally:
            self.files.clear_run_lock()

    def refuse(self, tag: str, status: int) -> None:
        if status != OLD_SERVER_STATUS:
            super().refuse(tag, status)
        CodeReplacement(self.home).run([lambda: self.versions.switch(tag)])

    def wait_new_server(self, running_pid: str) -> None:
        if self.server_pid() == running_pid:
            super().wait_new_server(running_pid)


if __name__ == "__main__":
    print(f"the new server took over in {WorkingTreeInstall(JournalHome(Path(sys.argv[1]) / '.journal')).run(Path(sys.argv[2])):.2f} seconds")
