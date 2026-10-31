import socket
from pathlib import Path

from core.modules.plugins.support.plugin_late_error import PluginLateError

READ_SIZE = 65536


class PluginSocket:
    """Asks a plugin's answering service for an event: the line written to its socket, one line read back
    within the time limit."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def is_open(self) -> bool:
        return self.path.is_socket()

    def ask(self, line: str, limit_ms: int) -> str:
        connection = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        connection.settimeout(limit_ms / 1000)
        try:
            connection.connect(str(self.path))
            connection.sendall((line + "\n").encode())
            received = b""
            while not received.endswith(b"\n"):
                part = connection.recv(READ_SIZE)
                if not part:
                    break
                received += part
            return received.decode()
        except TimeoutError:
            raise PluginLateError(f"its service ran past {limit_ms} ms") from None
        finally:
            connection.close()
