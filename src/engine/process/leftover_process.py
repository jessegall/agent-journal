import os
from pathlib import Path
import signal
import subprocess

from engine.caller.process_table import PS_ENVIRONMENT, PS_TIMEOUT_SECONDS
from engine.time.polled_wait import PolledWait

STOP_LIMIT_SECONDS = 5
POLL_SECONDS = 0.05


class LeftoverProcess:
    """A process a killed journal left running, found by its saved pid and stopped with its group. Its command
    line is checked once, by the program it runs (the name of its first or second word, as for an
    interpreter), never by a word anywhere in it, since a path such as /tmp/claude-501 holds a program's
    name; after the signal it is watched by its pid alone, so the wait starts no process per poll."""

    @classmethod
    def stop(cls, pid: int, program: str) -> bool:
        if not cls.runs_program(pid, program):
            return True
        cls.signal(pid, signal.SIGTERM)
        if PolledWait(STOP_LIMIT_SECONDS, POLL_SECONDS).until(lambda: not cls.is_running(pid)):
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

    @classmethod
    def runs_program(cls, pid: int, program: str) -> bool:
        command = cls.command_line(pid)
        if not command or not program:
            return False
        if command == program:
            return True
        name = Path(program.split()[0]).name
        return any(Path(word).name == name for word in command.split()[:2])

    @staticmethod
    def command_line(pid: int) -> str:
        try:
            return subprocess.run(["ps", "-ww", "-o", "command=", "-p", str(pid)], capture_output=True, text=True, check=False, timeout=PS_TIMEOUT_SECONDS,
                                  env=PS_ENVIRONMENT).stdout.strip()
        except subprocess.TimeoutExpired:
            return ""
