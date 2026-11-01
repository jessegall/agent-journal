import socket
import threading
from unittest.mock import MagicMock

from server.viewer.viewer_listener import ViewerListener


def listener(last_port: int = 0, port_wait_seconds: float = 0.0) -> ViewerListener:
    return ViewerListener(MagicMock(), MagicMock(), last_port, port_wait_seconds)


def test_a_restarted_viewer_listens_on_the_port_it_had():
    first = listener()
    port = first.port
    first.server_close()
    second = listener(port)
    assert second.port == port
    second.server_close()


def test_a_port_that_is_taken_gives_a_port_the_system_picks():
    holder = socket.socket()
    holder.bind(("127.0.0.1", 0))
    holder.listen()
    busy_port = holder.getsockname()[1]
    second_listener = listener(busy_port)
    assert second_listener.port != busy_port and second_listener.port > 0
    second_listener.server_close()
    holder.close()


def test_a_restart_waits_for_the_old_server_to_let_its_port_go():
    holder = socket.socket()
    holder.bind(("127.0.0.1", 0))
    holder.listen()
    busy_port = holder.getsockname()[1]
    threading.Timer(0.3, holder.close).start()
    next_listener = listener(busy_port, port_wait_seconds=5.0)
    assert next_listener.port == busy_port
    next_listener.server_close()
