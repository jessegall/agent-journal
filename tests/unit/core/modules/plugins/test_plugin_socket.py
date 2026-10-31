import socket
import threading
import time
from pathlib import Path

import pytest

from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_socket import PluginSocket

LIMIT_MS = 500
END_SECONDS = 1.5
BYTE_PAUSE_SECONDS = 0.2


def slow_service(path: Path) -> None:
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(str(path))
    server.listen()
    connection, _ = server.accept()
    connection.recv(1024)
    try:
        for part in b'{"v": 1, "answer": "allow"}':
            connection.sendall(bytes([part]))
            time.sleep(BYTE_PAUSE_SECONDS)
    except OSError:
        pass
    connection.close()
    server.close()


def test_an_answer_sent_a_byte_at_a_time_ends_at_the_window(tmp_path: Path) -> None:
    path = Path("/tmp") / f"plugin-socket-{id(tmp_path)}.sock"
    thread = threading.Thread(target=slow_service, args=[path], daemon=True)
    thread.start()
    while not path.is_socket():
        time.sleep(0.01)
    started = time.monotonic()
    try:
        with pytest.raises(PluginLateError):
            PluginSocket(path).ask('{"v": 1}', LIMIT_MS)
        assert time.monotonic() - started < END_SECONDS
    finally:
        path.unlink(missing_ok=True)
