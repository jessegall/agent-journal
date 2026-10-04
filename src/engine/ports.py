import socket
import urllib.error
import urllib.request

HOST = "127.0.0.1"
REACH_SECONDS = 3


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


def status_of(url: str, wait: float = REACH_SECONDS) -> int:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=wait) as answer:
            return answer.status
    except urllib.error.HTTPError as error:
        return error.code
    except (OSError, ValueError):
        return 0


def answers(url: str, wait: float = REACH_SECONDS) -> bool:
    return 0 < status_of(url, wait) < 500


def reached(url: str, wait: float = REACH_SECONDS) -> bool:
    return status_of(url, wait) > 0
