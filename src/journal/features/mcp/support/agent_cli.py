import fcntl
import os
import pty
import struct
import subprocess
import termios

from journal.config import Config
from journal.support.rejection import Rejection

CLI_SECONDS = 60
# a terminal this wide never folds the long sign-in address a program prints across lines
TERMINAL_COLUMNS = 4000


class AgentCli:
    """The one way the journal runs the agent program's own command line from the server: in a session of its own, with no terminal or a private one only it holds, so a program that asks something or changes the terminal can never reach the journal's or the agent's, and a program that is missing or slow is a refusal and never a fault."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def run(self, command: list[str]) -> subprocess.CompletedProcess:
        try:
            return subprocess.run(command, cwd=self.config.root, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=CLI_SECONDS, start_new_session=True)
        except (OSError, subprocess.TimeoutExpired) as failed:
            raise Rejection(f"{command[0]} could not be run: {failed}") from failed

    def in_terminal(self, command: list[str]) -> tuple[subprocess.Popen, int]:
        """Starts the command in a private terminal, for a program that works only in one, and returns it with the terminal's end the journal reads and types into."""
        leader, follower = pty.openpty()
        fcntl.ioctl(follower, termios.TIOCSWINSZ, struct.pack("HHHH", 24, TERMINAL_COLUMNS, 0, 0))
        try:
            return subprocess.Popen(command, cwd=self.config.root, stdin=follower, stdout=follower, stderr=follower, start_new_session=True), leader
        except OSError as failed:
            os.close(leader)
            raise Rejection(f"{command[0]} could not be run: {failed}") from failed
        finally:
            os.close(follower)
