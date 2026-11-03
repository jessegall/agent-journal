from core.base.journal_home import JournalHome
from core.base.server_restart_state import ServerRestartState


class RunQueueHalt:
    """Whether the queue of test runs grants no spots: a command halted it, with a reason it keeps in a file until a
    command resumes it, or the server is restarting, which holds it until the restart is done."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def command_halted(self) -> bool:
        return self.home.run_queue_halt_file.is_file()

    @property
    def is_restarting(self) -> bool:
        return ServerRestartState(self.home).is_restarting

    @property
    def is_halted(self) -> bool:
        return self.command_halted or self.is_restarting

    @property
    def reason(self) -> str:
        return self.home.run_queue_halt_file.read_text().strip() if self.command_halted else ""

    def halt(self, reason: str) -> None:
        self.home.run_queue_halt_file.write_text(reason)

    def resume(self) -> None:
        self.home.run_queue_halt_file.unlink(missing_ok=True)
