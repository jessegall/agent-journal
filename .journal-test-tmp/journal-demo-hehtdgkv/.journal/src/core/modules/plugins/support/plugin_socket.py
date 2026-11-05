import socket
import time
from pathlib import Path

from core.modules.plugins.support.plugin_late_error import PluginLateError

READ_SIZE = 65536


class PluginSocket:
    """Asks a plugin's answering service for an event: the line written to its socket, one line read back,
    the whole of it within the time limit however the service sends it."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def is_open(self) -> bool:
        return self.path.is_socket()

    def ask(self, line: str, limit_ms: int) -> str:
        deadline = time.monotonic() + limit_ms / 1000
        connection = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        try:
            connection.settimeout(self.remaining(deadline, limit_ms))
            connection.connect(str(self.path))
            connection.sendall((line + "\n").encode())
            received = b""
            while not received.endswith(b"\n"):
                connection.settimeout(self.remaining(deadline, limit_ms))
                part = connection.recv(READ_SIZE)
                if not part:
                    break
                received += part
            return received.decode()
        except TimeoutError:
            raise PluginLateError(f"its service ran past {limit_ms} ms") from None
        finally:
            connection.close()

    @staticmethod
    def remaining(deadline: float, limit_ms: int) -> float:
        seconds = deadline - time.monotonic()
        if seconds <= 0:
            raise PluginLateError(f"its service ran past {limit_ms} ms")
        return seconds
