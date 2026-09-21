import hashlib
import socket
from pathlib import Path

LONGEST = 65536


def folder(root: Path) -> Path:
    return Path("/tmp") / f"journal-{hashlib.sha1(str(Path(root).resolve()).encode()).hexdigest()[:16]}"


def path(root: Path, session: str) -> Path:
    return folder(root) / f"typist-{session}.sock"


def listen(root: Path, session: str) -> socket.socket:
    where = path(root, session)
    where.parent.mkdir(parents=True, exist_ok=True)
    where.unlink(missing_ok=True)
    inbox = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    inbox.bind(str(where))
    inbox.setblocking(False)
    return inbox


def receive(inbox: socket.socket) -> list[bytes]:
    packets = []
    while True:
        try:
            packets.append(inbox.recv(LONGEST))
        except (BlockingIOError, InterruptedError):
            return packets


def close(inbox: socket.socket, root: Path, session: str) -> None:
    inbox.close()
    path(root, session).unlink(missing_ok=True)


def send(root: Path, session: str, raw: bytes) -> bool:
    mouth = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    try:
        for at in range(0, len(raw), LONGEST):
            mouth.sendto(raw[at:at + LONGEST], str(path(root, session)))
        return True
    except OSError:
        return False
    finally:
        mouth.close()


def live(root: Path) -> list[str]:
    return sorted(p.name.removeprefix("typist-").removesuffix(".sock") for p in folder(root).glob("typist-*.sock") if reachable(p))


def reachable(where: Path) -> bool:
    mouth = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    try:
        mouth.connect(str(where))
        return True
    except OSError:
        return False
    finally:
        mouth.close()
