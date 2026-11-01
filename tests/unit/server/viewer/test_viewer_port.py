import socket
from unittest.mock import MagicMock

from server.viewer.viewer_listener import ViewerListener


def listener(remembered_port: int = 0) -> ViewerListener:
    return ViewerListener(MagicMock(), MagicMock(), remembered_port)


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
    taken = holder.getsockname()[1]
    other = listener(taken)
    assert other.port != taken and other.port > 0
    other.server_close()
    holder.close()
