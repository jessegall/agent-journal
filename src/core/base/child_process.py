import os
import signal
import subprocess
from typing import Any


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

    def wait(self, limit_seconds: float) -> int:
        return self.process.wait(limit_seconds)

    def stop_group(self, limit_seconds: float) -> None:
        if not self.running():
            return
        os.killpg(self.process.pid, signal.SIGTERM)
        try:
            self.process.wait(limit_seconds)
        except subprocess.TimeoutExpired:
            os.killpg(self.process.pid, signal.SIGKILL)
            self.process.wait(limit_seconds)

    def stop(self, limit_seconds: float) -> None:
        if not self.running():
            return
        self.process.terminate()
        try:
            self.process.wait(limit_seconds)
        except subprocess.TimeoutExpired:
            self.process.kill()
            self.process.wait(limit_seconds)
