import os
import signal
import subprocess
import time

STOP_LIMIT_SECONDS = 5
POLL_SECONDS = 0.05


class LeftoverProcess:
    """A process a journal that was killed left running, found by the pid it kept on disk: stopped only when that
    pid still runs the program named, its process group with it when it leads one."""

    @classmethod
    def stop(cls, pid: int, program: str) -> None:
        if program not in cls.command_line(pid):
            return
        cls.signal(pid, signal.SIGTERM)
        deadline = time.monotonic() + STOP_LIMIT_SECONDS
        while program in cls.command_line(pid) and time.monotonic() < deadline:
            time.sleep(POLL_SECONDS)
        if program in cls.command_line(pid):
            cls.signal(pid, signal.SIGKILL)

    @staticmethod
    def signal(pid: int, number: signal.Signals) -> None:
        try:
            os.killpg(pid, number)
        except (ProcessLookupError, PermissionError):
            os.kill(pid, number)

    @staticmethod
    def command_line(pid: int) -> str:
        return subprocess.run(["ps", "-o", "command=", "-p", str(pid)], capture_output=True, text=True, check=False).stdout.strip()
