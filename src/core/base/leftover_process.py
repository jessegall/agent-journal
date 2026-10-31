import os
import signal
import subprocess
import time

from core.base.caller.process_table import PS_ENVIRONMENT, PS_TIMEOUT_SECONDS

STOP_LIMIT_SECONDS = 5
POLL_SECONDS = 0.05


class LeftoverProcess:
    """A process a journal that was killed left running, found by the pid it kept on disk: stopped only when that
    pid still runs the program named, its process group with it when it leads one; a ps that does not answer in
    time, or a process gone meanwhile, leaves it alone."""

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
    def signal(pid: int, number: int) -> None:
        try:
            os.killpg(pid, number)
        except (ProcessLookupError, PermissionError):
            try:
                os.kill(pid, number)
            except ProcessLookupError:
                return

    @staticmethod
    def command_line(pid: int) -> str:
        try:
            return subprocess.run(["ps", "-o", "command=", "-p", str(pid)], capture_output=True, text=True, check=False, timeout=PS_TIMEOUT_SECONDS,
                                  env=PS_ENVIRONMENT).stdout.strip()
        except subprocess.TimeoutExpired:
            return ""
