import socket
import threading
import time
from pathlib import Path

import pytest

from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_socket import PluginSocket

LIMIT_MS = 500
BYTE_PAUSE_SECONDS = 0.2
ANSWER = b'{"v": 1, "answer": "allow"}'
FULL_ANSWER_SECONDS = len(ANSWER) * BYTE_PAUSE_SECONDS


def slow_service(server: socket.socket, finished: threading.Event) -> None:
    connection, _ = server.accept()
    connection.recv(1024)
    connection.sendall(ANSWER[:1])
    finished.wait(FULL_ANSWER_SECONDS)
    connection.close()
    server.close()


def test_an_answer_sent_a_byte_at_a_time_ends_at_the_window(tmp_path: Path) -> None:
    path = Path("/tmp") / f"plugin-socket-{id(tmp_path)}.sock"
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(str(path))
    server.listen()
    finished = threading.Event()
    thread = threading.Thread(target=slow_service, args=[server, finished], daemon=True)
    thread.start()
    started = time.monotonic()
    try:
        with pytest.raises(PluginLateError):
            PluginSocket(path).ask('{"v": 1}', LIMIT_MS)
        assert time.monotonic() - started < FULL_ANSWER_SECONDS
    finally:
        finished.set()
        path.unlink(missing_ok=True)
