import os
import signal
import subprocess
from typing import Any

from engine.execution.held_write_turn import HELD_WRITE_TURN


class ChildProcess:
    """A program the journal started: whether it still runs, its process id, and its end within a time limit,
    alone or with the process group it leads."""

    def __init__(self, process: "subprocess.Popen[Any]") -> None:
        self.process = process

    @property
    def pid(self) -> int:
        return self.process.pid

    def running(self) -> bool:
        return self.process.poll() is None

    def exit_code(self) -> int | None:
        return self.process.poll()

    def wait(self, limit_seconds: float | None = None) -> int:
        HELD_WRITE_TURN.refuse_wait(f"the wait for process {self.process.pid}")
        return self.process.wait(limit_seconds)

    # writes the input, reads both outputs to their end and waits for the program, within the limit when one is given;
    # a quick run of the door in a handler is the shell-command-under-the-write-lock rule's to judge, not this guard's
    def communicate(self, text: Any = None, limit_seconds: float | None = None) -> tuple[Any, Any]:
        return self.process.communicate(text, timeout=limit_seconds)

    def stop_group(self, limit_seconds: float) -> None:
        HELD_WRITE_TURN.refuse_wait(f"the stop of process group {self.process.pid}")
        self.signal_group(signal.SIGTERM)
        try:
            self.process.wait(limit_seconds)
        except subprocess.TimeoutExpired:
            self.signal_group(signal.SIGKILL)
            self.process.wait(limit_seconds)
            return
        self.signal_group(signal.SIGKILL)

    def signal_group(self, number: signal.Signals) -> None:
        try:
            os.killpg(self.process.pid, number)
        except (ProcessLookupError, PermissionError):
            return

    def stop(self, limit_seconds: float) -> None:
        if not self.running():
            return
        HELD_WRITE_TURN.refuse_wait(f"the stop of process {self.process.pid}")
        self.process.terminate()
        try:
            self.process.wait(limit_seconds)
        except subprocess.TimeoutExpired:
            self.process.kill()
            self.process.wait(limit_seconds)
