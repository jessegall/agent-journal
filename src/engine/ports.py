import socket

HOST = "127.0.0.1"


def free(port: int) -> bool:
    with socket.socket() as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((HOST, port))
        except OSError:
            return False
    return True


def url_of(port: int) -> str:
    return f"http://{HOST}:{port}/"
