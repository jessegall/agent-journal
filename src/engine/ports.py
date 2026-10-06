import hashlib
import os
import socket
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

HOST = "127.0.0.1"
REACH_SECONDS = 3
RESERVED_FOR = 60.0
RESERVED = Path(tempfile.gettempdir()) / f"journal-ports-{os.getuid()}"


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


def vouched(url: str, marker: str, wait: float = REACH_SECONDS) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=wait) as answer:
            return answer.status == 200 and marker in answer.read(len(marker) + 64).decode(errors="ignore")
    except (OSError, ValueError):
        return False


def reserve(port: int, owner: str) -> bool:
    RESERVED.mkdir(exist_ok=True)
    claim = RESERVED / str(port)
    name = hashlib.sha1(owner.encode()).hexdigest()
    try:
        if claim.read_text() == name or time.time() - claim.stat().st_mtime >= RESERVED_FOR:
            claim.unlink(missing_ok=True)
    except OSError:
        pass
    mine = RESERVED / f"{port}.{os.getpid()}"
    mine.write_text(name)
    try:
        os.link(mine, claim)
    except FileExistsError:
        return False
    finally:
        mine.unlink(missing_ok=True)
    return True
