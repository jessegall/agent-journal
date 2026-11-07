import os
import signal
import subprocess
import time

from core.base.caller.process_table import PS_ENVIRONMENT, PS_TIMEOUT_SECONDS

STOP_LIMIT_SECONDS = 5
POLL_SECONDS = 0.05


class LeftoverProcess:
    """A process a killed journal left running, found by its saved pid and stopped with its group. Its command line
    is checked once; after the signal it is watched by its pid alone, so the wait starts no process per poll."""

    @classmethod
    def stop(cls, pid: int, program: str) -> bool:
        if program not in cls.command_line(pid):
            return True
        cls.signal(pid, signal.SIGTERM)
        deadline = time.monotonic() + STOP_LIMIT_SECONDS
        while cls.is_running(pid) and time.monotonic() < deadline:
            time.sleep(POLL_SECONDS)
        if not cls.is_running(pid):
            return True
        cls.signal(pid, signal.SIGKILL)
        return False

    @classmethod
    def is_running(cls, pid: int) -> bool:
        if cls.is_reaped(pid):
            return False
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        except PermissionError:
            return True
        return True

    @staticmethod
    def is_reaped(pid: int) -> bool:
        try:
            return os.waitpid(pid, os.WNOHANG)[0] == pid
        except ChildProcessError:
            return False

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
            return subprocess.run(["ps", "-ww", "-o", "command=", "-p", str(pid)], capture_output=True, text=True, check=False, timeout=PS_TIMEOUT_SECONDS,
                                  env=PS_ENVIRONMENT).stdout.strip()
        except subprocess.TimeoutExpired:
            return ""
