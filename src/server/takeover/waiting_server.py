import os
import socket
from pathlib import Path

from engine.version.code_versions import CodeVersions
from engine.journal.journal_home import JournalHome
from server.takeover.takeover_descriptors import READY_BYTE, TakeoverDescriptors
from server.takeover.successor_proof import SuccessorProof


class WaitingServer:
    """A new server beside the old one: it holds the sockets it was handed and serves nothing, proves its code,
    tells the old server it is ready, and waits for that server to exit before it takes the code link, so the
    two never serve at once."""

    def __init__(self, home: JournalHome, descriptors: TakeoverDescriptors) -> None:
        self.home, self.descriptors = home, descriptors

    def journal_socket(self) -> socket.socket:
        return socket.socket(fileno=self.descriptors.journal_socket)

    def viewer_socket(self) -> socket.socket:
        return socket.socket(fileno=self.descriptors.viewer_socket)

    def wait_turn(self) -> None:
        SuccessorProof(self.home).run()
        os.write(self.descriptors.ready_pipe, READY_BYTE)
        os.close(self.descriptors.ready_pipe)
        os.read(self.descriptors.exit_pipe, len(READY_BYTE))
        os.close(self.descriptors.exit_pipe)
        CodeVersions(self.home).switch(Path(__file__).resolve().parents[2].name)
