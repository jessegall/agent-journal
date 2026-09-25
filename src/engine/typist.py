import errno
import hashlib
import socket
import time
from pathlib import Path

PACKET = 2048
FULL_FOR = 2.0


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
        return all(sent(mouth, raw[at:at + PACKET], str(path(root, session))) for at in range(0, len(raw), PACKET))
    finally:
        mouth.close()


def sent(mouth: socket.socket, packet: bytes, where: str) -> bool:
    until = time.time() + FULL_FOR
    while True:
        try:
            mouth.sendto(packet, where)
            return True
        except (BlockingIOError, InterruptedError):
            pass
        except OSError as e:
            if e.errno != errno.ENOBUFS or time.time() > until:
                return False
        if time.time() > until:
            return False
        time.sleep(0.01)


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
