from core.base.leftover_process import LeftoverProcess


class AdoptedProcess:
    """A service an earlier server started and left running over a restart, known by its pid."""

    def __init__(self, pid: int, program: str) -> None:
        self.pid, self.program = pid, program

    def running(self) -> bool:
        return LeftoverProcess.is_running(self.pid)

    def exit_code(self) -> int | None:
        return None if self.running() else 0

    def stop_group(self, limit_seconds: float) -> None:
        LeftoverProcess.stop(self.pid, self.program)
