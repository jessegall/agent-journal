from dataclasses import dataclass


@dataclass(frozen=True)
class ProgramExit:
    """What the launcher says of a program that exited: its exit code, the process it ran in when the launcher
    names it, and whether the launcher itself ended it."""

    exit_code: int
    pid: int | None = None
    launch_ended: bool = False

    def is_other_process(self, pid: int | None) -> bool:
        return self.pid is not None and pid is not None and self.pid != pid
