import os
import socket
from pathlib import Path

LONGEST = 65536


def path(root: Path, session: str) -> Path:
    return Path(root) / "runtime" / f"typist-{session}.sock"


def listen(root: Path, session: str) -> socket.socket:
    where = path(root, session)
    where.parent.mkdir(parents=True, exist_ok=True)
    where.unlink(missing_ok=True)
    ear = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    ear.bind(str(where))
    ear.setblocking(False)
    return ear


def heard(ear: socket.socket) -> list[bytes]:
    said = []
    while True:
        try:
            said.append(ear.recv(LONGEST))
        except (BlockingIOError, InterruptedError):
            return said


def close(ear: socket.socket, root: Path, session: str) -> None:
    ear.close()
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
    folder = Path(root) / "runtime"
    return sorted(p.name.removeprefix("typist-").removesuffix(".sock") for p in folder.glob("typist-*.sock") if reachable(p))


def reachable(where: Path) -> bool:
    mouth = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    try:
        mouth.connect(str(where))
        return True
    except OSError:
        return False
    finally:
        mouth.close()
