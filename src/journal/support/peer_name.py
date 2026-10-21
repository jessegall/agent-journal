import re
import subprocess
from pathlib import Path

SOCKET = re.compile(r"^uds:(?P<path>.*/(?P<pid>\d+)\.sock)$")
LSOF_SECONDS = 5


class PeerName:
    """The name of another session a message goes to: the session's own name when it is one, such as worldwatchmarket-93, or the project folder of the process behind its socket, and the socket's path alone when neither is known."""

    def resolve(self, receiver: str) -> str:
        socket = SOCKET.match(receiver.strip())
        if not socket:
            return receiver
        return self.project_folder(int(socket.group("pid"))) or receiver

    @staticmethod
    def project_folder(pid: int) -> str:
        try:
            listed = subprocess.run(["lsof", "-a", "-p", str(pid), "-d", "cwd", "-Fn"], capture_output=True, text=True, timeout=LSOF_SECONDS)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        folders = [line[1:] for line in listed.stdout.splitlines() if line.startswith("n/")]
        return Path(folders[0]).name if folders else ""
