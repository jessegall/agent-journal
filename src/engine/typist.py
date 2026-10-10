import errno
import json
import os
import socket
import time
from pathlib import Path
from engine.wording import digest

PACKET = 2048
FULL_FOR = 2.0


def folder(root: Path) -> Path:
    shared = Path("/tmp") / f"journal-{digest(str(Path(root).resolve()), 16)}"
    return shared if not shared.exists() or shared.stat().st_uid == os.getuid() else shared.with_name(f"{shared.name}-{os.getuid()}")


def path(root: Path, session: str) -> Path:
    return folder(root) / f"typist-{session}.sock"


def listen(root: Path, session: str) -> socket.socket:
    where = path(root, session)
    where.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    where.unlink(missing_ok=True)
    inbox = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    inbox.bind(str(where))
    inbox.setblocking(False)
    return inbox


def receive(inbox: socket.socket) -> list[bytes]:
    packets = []
    while True:
        try:
            packets.append(inbox.recv(PACKET))
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


LIVE_FILE = "live-sockets.json"
LISTED_FRESH = 6.0


def publish_live(root: Path) -> list[str]:
    """Found by the supervising process, once a few seconds for the whole journal, and written for every environment's process to read."""
    from engine.stored import write_text
    found = live(root)
    write_text(folder(root) / LIVE_FILE, json.dumps({"at": time.time(), "sessions": found}))
    return found


def listed(root: Path) -> list[str]:
    """The live sessions as the supervising process last wrote them; found here, socket by socket, only when it has not written lately."""
    try:
        written = json.loads((folder(root) / LIVE_FILE).read_text())
        if time.time() - float(written["at"]) < LISTED_FRESH:
            return [str(session) for session in written["sessions"]]
    except (OSError, ValueError, KeyError, TypeError):
        pass
    return live(root)


def reachable(where: Path) -> bool:
    mouth = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    try:
        mouth.connect(str(where))
        return True
    except OSError:
        return False
    finally:
        mouth.close()
