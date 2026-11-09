import os
import socket
import subprocess
import time

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome

SERVICE_ARGUMENT = "launcher-service"
STANDALONE_ARGUMENT = "--standalone"
START_LIMIT_SECONDS = 5
POLL_SECONDS = 0.1


class LauncherService:
    """Starts a launcher of its own, apart from any terminal, when the one that held the launcher's socket is gone,
    and waits until it answers on the socket."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def start(self) -> bool:
        binary = self.home.folder / "bin" / "journal"
        if not binary.is_file():
            return False
        subprocess.Popen([str(binary), SERVICE_ARGUMENT, STANDALONE_ARGUMENT], env={**os.environ, "JOURNAL_HOME": str(self.home.folder)},
                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        deadline = time.monotonic() + START_LIMIT_SECONDS
        while time.monotonic() < deadline:
            if self.is_answering():
                return True
            time.sleep(POLL_SECONDS)
        return False

    def is_answering(self) -> bool:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            try:
                connection.connect(str(self.home.socket(LAUNCHER_SOCKET)))
            except OSError:
                return False
        return True
