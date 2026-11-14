import threading
import time
from pathlib import Path

from engine.time.clock import Clock
from engine.version.code_versions import CodeVersions
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.connection.unix_connection import UnixConnection
from engine.enums.log_level import LogLevel
from engine.serving.update_steps import FAILED, FINISHED, HANDOVER, PROOF, SERVING, UpdateSteps
from engine.serving.server_files import ServerFiles
from engine.serving.server_limits import PROOF_LIMIT_SECONDS
from engine.serving.launcher_replacement import LauncherReplacement
from engine.time.polled_wait import PolledWait

TAKEOVER_LIMIT_SECONDS = 90
PID_POLL_SECONDS = 0.02


class CodeHandover:
    """Puts new code in use without stopping the journal: copies it beside the running code and asks the
    server to hand over to it, so requests wait in the socket's queue and none is refused. With no server
    running, the link moves at once."""

    def __init__(self, home: JournalHome, steps: UpdateSteps = UpdateSteps()) -> None:
        self.home, self.versions, self.files, self.steps, self.clock = home, CodeVersions(home), ServerFiles(home), steps, Clock()

    def run(self, source: Path) -> float:
        tag = self.versions.add(source, self.clock)
        running_pid = self.server_pid()
        started_seconds = time.monotonic()
        try:
            self.switch_code(tag, running_pid)
        except Refusal as refusal:
            self.steps.record(FAILED, refusal.text)
            raise
        self.steps.record(FINISHED, tag)
        return time.monotonic() - started_seconds

    def switch_code(self, tag: str, running_pid: str) -> None:
        if running_pid:
            self.steps.record(PROOF)
        self.request_takeover(tag, running_pid)
        if running_pid:
            self.steps.record(HANDOVER)
            self.wait_new_server(running_pid)
            self.steps.record(SERVING)

    def begin(self, source: Path) -> None:
        self.begin_version(self.versions.add(source, self.clock), self.server_pid())

    def begin_version(self, tag: str, running_pid: str) -> None:
        threading.Thread(target=self.background_takeover, args=(tag, running_pid), name="code handover", daemon=True).start()

    def background_takeover(self, tag: str, running_pid: str) -> None:
        try:
            self.steps.record(PROOF)
            self.request_takeover(tag, running_pid)
        except Exception as error:
            self.files.log_line(f"code version {tag} handover failed: {type(error).__name__}: {error}", LogLevel.ERROR)
            self.steps.record(FAILED, error.text if isinstance(error, Refusal) else str(error))
            return
        self.steps.record(HANDOVER if running_pid else FINISHED, tag)

    def request_takeover(self, tag: str, running_pid: str) -> None:
        if not running_pid:
            self.versions.switch(tag)
        elif (status := self.takeover_status(tag)) != 200:
            self.refuse(tag, status)
        LauncherReplacement(self.home).run()

    def refuse(self, tag: str, status: int) -> None:
        raise Refusal(f"code version {tag} was not taken over: status {status}", f"the running server keeps serving: read {self.files.log}")

    def server_pid(self) -> str:
        return FileAccess.read(self.files.pid_file).strip() if FileAccess.is_file(self.files.pid_file) else ""

    def takeover_status(self, tag: str) -> int:
        connection = UnixConnection(str(self.files.socket), PROOF_LIMIT_SECONDS + TAKEOVER_LIMIT_SECONDS, "journal")
        try:
            connection.request("POST", f"/handover?tag={tag}")
            return connection.getresponse().status
        finally:
            connection.close()

    def wait_new_server(self, running_pid: str) -> None:
        if not PolledWait(TAKEOVER_LIMIT_SECONDS, PID_POLL_SECONDS).poll(lambda: self.server_pid() != running_pid):
            raise Refusal("the new server did not take over", f"read {self.files.log}")
