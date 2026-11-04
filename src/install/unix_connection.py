import http.client
import socket

CONNECTION_SECONDS = 5


class UnixConnection(http.client.HTTPConnection):
    """An HTTP connection to the journal server's unix socket."""

    def __init__(self, path: str, timeout_seconds: float = CONNECTION_SECONDS) -> None:
        super().__init__("journal", timeout=timeout_seconds)
        self.path = path

    def connect(self) -> None:
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect(self.path)
