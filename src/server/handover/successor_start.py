import os
import select
import socket
import subprocess
import sys
from core.base.serving.server_limits import PROOF_LIMIT_SECONDS
from dataclasses import astuple
from pathlib import Path

from engine.version.code_versions import CodeVersions
from engine.journal.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from server.handover.handover_descriptors import READY_BYTE, HandoverDescriptors
from core.base.serving.server_files import ServerFiles

KILLED_WAIT_SECONDS = 5
PYTHON_PATH_VARIABLE = "PYTHONPATH"


class SuccessorStart:
    """Starts the server of a new code version beside the running one and waits until it has proved itself. The
    write end of the exit pipe stays open for as long as this process lives, so the new server starts serving
    when this process has gone. A new server that fails leaves everything as it was."""

    def __init__(self, home: JournalHome, files: ServerFiles, journal_socket: socket.socket, viewer_socket: socket.socket) -> None:
        self.home, self.files, self.journal_socket, self.viewer_socket = home, files, journal_socket, viewer_socket

    def run(self, tag: str) -> bool:
        ready_reader, ready_writer = os.pipe()
        exit_reader, self.exit_writer = os.pipe()
        descriptors = HandoverDescriptors(self.journal_socket.fileno(), self.viewer_socket.fileno(), self.files.lock_descriptor(), ready_writer, exit_reader)
        process = self.started(CodeVersions(self.home).version(tag), descriptors)
        os.close(ready_writer)
        os.close(exit_reader)
        ready = self.is_ready(ready_reader)
        os.close(ready_reader)
        if not ready:
            os.close(self.exit_writer)
            process.kill()
            process.wait(KILLED_WAIT_SECONDS)
            self.files.log_line(f"code version {tag} failed its proof; this server keeps serving", LogLevel.WARNING)
        return ready

    def started(self, version: Path, descriptors: HandoverDescriptors) -> subprocess.Popen[bytes]:
        environment = {**os.environ, PYTHON_PATH_VARIABLE: str(version)}
        with self.files.log.open("a") as log:
            return subprocess.Popen([sys.executable, str(version / "server" / "server.py"), "--home", str(self.home.folder), "--take-over", descriptors.text],
                                    cwd=self.home.folder.parent, env=environment, pass_fds=astuple(descriptors), stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                                    start_new_session=True)

    def is_ready(self, ready_reader: int) -> bool:
        readable, _, _ = select.select([ready_reader], [], [], PROOF_LIMIT_SECONDS)
        return bool(readable) and os.read(ready_reader, len(READY_BYTE)) == READY_BYTE
