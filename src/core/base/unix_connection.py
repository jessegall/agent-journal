import http.client
import socket


class UnixConnection(http.client.HTTPConnection):
    """An HTTP connection over a Unix socket."""

    def __init__(self, path: str, timeout: float, host: str) -> None:
        super().__init__(host, timeout=timeout)
        self.path = path

    def connect(self) -> None:
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect(self.path)
