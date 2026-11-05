import socket
import struct
import sys

LOCAL_SOCKET_LEVEL = 0
LOCAL_PEER_PID_OPTION = 2
CREDENTIALS_FORMAT = "3i"


def peer_pid(connection: socket.socket) -> int:
    if sys.platform == "darwin":
        return connection.getsockopt(LOCAL_SOCKET_LEVEL, LOCAL_PEER_PID_OPTION)
    credentials = connection.getsockopt(socket.SOL_SOCKET, socket.SO_PEERCRED, struct.calcsize(CREDENTIALS_FORMAT))
    pid, _, _ = struct.unpack(CREDENTIALS_FORMAT, credentials)
    return int(pid)
