import os
import socket

from server.door.socket_peer import SocketPeer, socket_peer


def test_a_socketpair_reports_this_process_as_the_peer():
    first, second = socket.socketpair(socket.AF_UNIX)
    with first, second:
        assert socket_peer(first) == SocketPeer(os.getpid(), os.getuid())
        assert socket_peer(second) == SocketPeer(os.getpid(), os.getuid())
