import socket
import struct
import sys
from dataclasses import dataclass

LOCAL_SOCKET_LEVEL = 0
LOCAL_PEER_CREDENTIALS_OPTION = 1
LOCAL_PEER_PID_OPTION = 2
LINUX_CREDENTIALS_FORMAT = "=iII"
MAC_CREDENTIALS_FORMAT = "=II"
MAC_CREDENTIALS_BYTES = 76


@dataclass(frozen=True)
class SocketPeer:
    """The process id and user id the kernel reports for the other end of a unix socket connection."""

    pid: int
    uid: int


def socket_peer(connection: socket.socket) -> SocketPeer:
    if sys.platform == "darwin":
        credentials = connection.getsockopt(LOCAL_SOCKET_LEVEL, LOCAL_PEER_CREDENTIALS_OPTION, MAC_CREDENTIALS_BYTES)
        _, uid = struct.unpack_from(MAC_CREDENTIALS_FORMAT, credentials)
        return SocketPeer(connection.getsockopt(LOCAL_SOCKET_LEVEL, LOCAL_PEER_PID_OPTION), uid)
    credentials = connection.getsockopt(socket.SOL_SOCKET, socket.SO_PEERCRED, struct.calcsize(LINUX_CREDENTIALS_FORMAT))
    pid, uid, _ = struct.unpack(LINUX_CREDENTIALS_FORMAT, credentials)
    return SocketPeer(pid, uid)
