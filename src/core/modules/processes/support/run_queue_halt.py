from engine.time.clock import Clock
from engine.journal.journal_home import JournalHome
from core.base.server_restart_state import ServerRestartState
from core.base.file_access import FileAccess
from core.modules.processes.support.output_folder import OutputFolder


class RunQueueHalt:
    """Whether the queue of test runs grants no spots: a command halted it, with a reason it keeps in a file until a
    command resumes it, or the server is restarting, or an update waits for the running commands, which hold
    it until they are done."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def command_halted(self) -> bool:
        return self.home.run_queue_halt_file.is_file()

    @property
    def is_restarting(self) -> bool:
        return ServerRestartState(self.home, Clock()).is_restarting

    @property
    def is_update_waiting(self) -> bool:
        return ServerRestartState(self.home, Clock()).has_run_lock

    @property
    def is_halted(self) -> bool:
        return self.command_halted or self.is_restarting or self.is_update_waiting

    @property
    def halt_type(self) -> str:
        if self.command_halted:
            return "command"
        if self.is_update_waiting:
            return "update"
        return "restart" if self.is_restarting else ""

    @property
    def reason(self) -> str:
        if self.command_halted:
            return FileAccess.shared().read(self.home.run_queue_halt_file).strip()
        if self.is_update_waiting:
            return "An update waits for the running commands to end"
        return "Server restart" if self.is_restarting else ""

    def running_run_ids(self) -> tuple[int, ...]:
        return OutputFolder(self.home).running_ids()

    def halt(self, reason: str) -> None:
        FileAccess.shared().write(self.home.run_queue_halt_file, reason)

    def resume(self) -> None:
        self.home.run_queue_halt_file.unlink(missing_ok=True)
