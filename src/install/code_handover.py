import threading
import time
from pathlib import Path

from core.base.code_versions import CodeVersions
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from install.unix_connection import UnixConnection
from server.server_files import ServerFiles
from server.successor_start import PROOF_LIMIT_SECONDS

TAKEOVER_LIMIT_SECONDS = 90
PID_POLL_SECONDS = 0.02


class CodeHandover:
    """Puts new code in use without stopping the journal: copies it beside the running code and asks the
    server to hand over to it, so requests wait in the socket's queue and none is refused. With no server
    running, the link moves at once."""

    def __init__(self, home: JournalHome) -> None:
        self.home, self.versions, self.files = home, CodeVersions(home), ServerFiles(home)

    def run(self, source: Path) -> float:
        tag = self.versions.add(source)
        running_pid = self.server_pid()
        started_seconds = time.monotonic()
        self.request_takeover(tag, running_pid)
        if running_pid:
            self.wait_new_server(running_pid)
        return time.monotonic() - started_seconds

    def begin(self, source: Path) -> None:
        tag = self.versions.add(source)
        threading.Thread(target=self.request_takeover, args=(tag, self.server_pid()), name="code handover", daemon=True).start()

    def request_takeover(self, tag: str, running_pid: str) -> None:
        if not running_pid:
            self.versions.switch(tag)
        elif (status := self.takeover_status(tag)) != 200:
            self.refuse(tag, status)

    def refuse(self, tag: str, status: int) -> None:
        raise Refusal(f"code version {tag} was not taken over: status {status}", f"the running server keeps serving: read {self.files.log}")

    def server_pid(self) -> str:
        return self.files.pid_file.read_text().strip() if self.files.pid_file.is_file() else ""

    def takeover_status(self, tag: str) -> int:
        connection = UnixConnection(str(self.files.socket), PROOF_LIMIT_SECONDS + TAKEOVER_LIMIT_SECONDS)
        try:
            connection.request("POST", f"/handover?tag={tag}")
            return connection.getresponse().status
        finally:
            connection.close()

    def wait_new_server(self, running_pid: str) -> None:
        deadline = time.monotonic() + TAKEOVER_LIMIT_SECONDS
        while self.server_pid() == running_pid:
            if time.monotonic() >= deadline:
                raise Refusal("the new server did not take over", f"read {self.files.log}")
            time.sleep(PID_POLL_SECONDS)
