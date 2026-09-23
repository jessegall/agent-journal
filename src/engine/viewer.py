import json
from dataclasses import asdict, dataclass
import os
import re
import signal
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from urllib.request import urlopen

from features.open_viewer.focus import existing_tab
from engine.stored import read_json, write_json, write_text
from engine.sessions import alive
from engine.version import version
from engine.package import entry
from engine.fields import number_of, text_of, whole_of

PORTS = range(8420, 8440)
HEARTBEAT = 2.0
PORT_WAIT = 30.0
URL = re.compile(r"http://127\.0\.0\.1:\d+/")


def machine() -> Path:
    return Path(os.environ.get("AGENT_JOURNAL_HOME") or Path.home() / ".journal") / "journals.json"


RESTARTING = 15.0


def marker(root: Path) -> Path:
    return root / "runtime" / "viewer.json"


@dataclass(frozen=True)
class KnownJournal:
    root: str
    project: str
    url: str
    at: float

    @classmethod
    def from_json(cls, raw: dict) -> "KnownJournal":
        return cls(text_of(raw, "root"), text_of(raw, "project"), text_of(raw, "url"), number_of(raw, "at"))


@dataclass(frozen=True)
class ViewerMark:
    url: str = ""
    at: float = 0.0
    port: int = 0
    pid: int = 0

    @classmethod
    def from_json(cls, raw) -> "ViewerMark":
        raw = raw if isinstance(raw, dict) else {}
        return cls(text_of(raw, "url"), number_of(raw, "at"), whole_of(raw, "port"), whole_of(raw, "pid"))


@dataclass(frozen=True)
class Identity:
    root: str
    project: str
    version: str

    @classmethod
    def from_json(cls, raw: dict) -> "Identity":
        return cls(text_of(raw, "root"), text_of(raw, "project"), text_of(raw, "version"))


def known() -> list[KnownJournal]:
    found = (KnownJournal.from_json(j) for j in read_json(machine(), []) if isinstance(j, dict))
    return [j for j in found if j.root]


def keep(entries: list[KnownJournal]) -> None:
    write_json(machine(), [asdict(j) for j in sorted(entries, key=lambda j: -j.at)])


def note(root: Path, url: str) -> None:
    root = root.resolve()
    keep([*(j for j in known() if j.root != str(root)), KnownJournal(str(root), root.parent.name, url, time.time())])


def forget(root: str) -> None:
    keep([j for j in known() if j.root != root])


def remember(root: Path, port: int) -> str:
    url = beat(root, port)
    note(root, url)
    return url


def beat(root: Path, port: int) -> str:
    url = f"http://127.0.0.1:{port}/"
    for target, text in ((marker(root), json.dumps({"url": url, "at": time.time(), "port": port, "pid": os.getpid()})), (root / "runtime" / "heartbeat", f"{int(time.time())} {url}\n")):
        write_text(target, text)
    return url


def heartbeat(root: Path, port: int, every: float = HEARTBEAT) -> None:
    def keep() -> None:
        while True:
            time.sleep(every)
            beat(root, port)
    threading.Thread(target=keep, daemon=True).start()


def candidates(root: Path) -> list[str]:
    found = []
    found.append(last(root).url)
    try:
        found.extend(URL.findall((root / "runtime" / "viewer.log").read_text())[-1:])
    except OSError:
        pass
    found.extend(f"http://127.0.0.1:{port}/" for port in PORTS)
    return list(dict.fromkeys(url for url in found if url))


def identity(url: str, timeout: float = 0.05) -> Identity | None:
    try:
        with urlopen(f"{url}api/identity", timeout=timeout) as response:
            raw = json.loads(response.read())
    except (OSError, ValueError):
        return None
    return Identity.from_json(raw) if isinstance(raw, dict) else None


def answers(url: str, root: Path, timeout: float = 0.05) -> bool:
    reply = identity(url, timeout)
    return reply is not None and Path(reply.root).resolve() == root.resolve() and reply.version == version()


def running(root: Path) -> str:
    return next((url for url in candidates(root) if answers(url, root)), "")


def marked(root: Path) -> str:
    url = candidates(root)[:1]
    return url[0] if url and answers(url[0], root, timeout=0.2) else ""


def free(port: int) -> bool:
    with socket.socket() as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
        return True


def waited(port: int, seconds: float = PORT_WAIT) -> bool:
    until = time.time() + seconds
    while not free(port):
        if time.time() >= until:
            return False
        time.sleep(0.1)
    return True


def available(prefer: int = 0) -> int:
    if prefer in PORTS and waited(prefer):
        return prefer
    if prefer:
        print(f"journal: port {prefer} is still taken after {PORT_WAIT:g}s; the viewer moves, and a tab left open on it will not reach this journal", file=sys.stderr)
    for port in PORTS:
        if free(port):
            return port
    raise OSError("no viewer port available from 8420 through 8439")


def last(root: Path) -> ViewerMark:
    return ViewerMark.from_json(read_json(marker(root), {}))


def restart(root: Path, project: Path) -> str:
    was = last(root)
    if was.pid and running(root):
        os.kill(was.pid, signal.SIGTERM)
        waited(was.port)
    return start(root, project)


def elsewhere(root: Path) -> str:
    was = last(root)
    if not was.pid or was.pid == os.getpid() or not alive(was.pid):
        return ""
    until = time.time() + RESTARTING
    while time.time() < until:
        if answers(was.url, root, timeout=0.2):
            return was.url
        time.sleep(0.2)
    return ""


def start(root: Path, project: Path) -> str:
    return launch(root, project)[0]


def launch(root: Path, project: Path) -> tuple[str, int | None]:
    already = running(root) or elsewhere(root)
    if already:
        return already, None
    port = available(last(root).port)
    log = root / "runtime" / "viewer.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    command = [*entry("journal"), "--root", str(root), "serve", "--port", str(port)]
    with log.open("a") as output:
        server = subprocess.Popen(command, cwd=project, stdin=subprocess.DEVNULL, stdout=output, stderr=output, start_new_session=True)
    for _ in range(60):
        time.sleep(0.1)
        url = running(root)
        if url:
            return url, None
        if server.poll() is not None:
            return "", server.returncode
    return "", None


def show(url: str, opener=webbrowser.open, focuser=existing_tab) -> str:
    if url and not focuser(url):
        opener(url)
    return url


def ensure(root: Path, project: Path, opener=webbrowser.open, focuser=existing_tab) -> str:
    return show(start(root, project), opener, focuser)
