import fcntl
import json
from dataclasses import asdict, dataclass
import os
import re
import signal
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen

from engine import runtime
from engine.focus import existing_tab
from engine.stored import append_text, read_json, write_json, write_text
from engine.sessions import alive
from engine.version import version
from engine.package import entry
from engine.ports import free, url_of
from resources.fields import Loaded
from engine.machines import journal_home
from resources.base import Refused

PORTS = [int(port) for port in os.environ["JOURNAL_VIEWER_PORTS"].split(",")] if os.environ.get("JOURNAL_VIEWER_PORTS") else range(8420, 8440)
RUNNING_FOR = 5.0
RUNNING: dict[str, tuple[float, str]] = {}
SERVING: dict[str, str] = {}
HEARTBEAT = 2.0
PULSE_EVERY = 1.0
LAUNCHING = "viewer.launching"
COMING_UP = 20.0
STOPPED_BY_US = 0
PORT_WAIT = 30.0
OWN_PORT_WAIT = 300.0
SERVED_ON = 8430
URL = re.compile(r"http://127\.0\.0\.1:\d+/")


def machine() -> Path:
    return journal_home() / "journals.json"


RESTARTING = 15.0


def marker(root: Path) -> Path:
    return runtime.folder(root) / "viewer.json"


@dataclass(frozen=True)
class KnownJournal(Loaded):
    root: str = ""
    project: str = ""
    url: str = ""
    at: float = 0.0


@dataclass(frozen=True)
class ViewerMark(Loaded):
    url: str = ""
    at: float = 0.0
    port: int = 0
    pid: int = 0


@dataclass(frozen=True)
class Identity(Loaded):
    root: str = ""
    project: str = ""
    version: str = ""
    build: str = ""
    pid: int = 0

    def serves(self, root: Path) -> bool:
        return Path(self.root).resolve() == root.resolve()


def known() -> list[KnownJournal]:
    found = (KnownJournal.from_json(j) for j in read_json(machine(), list, []) if isinstance(j, dict))
    return [j for j in found if j.root and Path(j.root).is_dir()]


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
    SERVING[str(Path(root).resolve())] = url
    return url


def beat(root: Path, port: int) -> str:
    url = url_of(port)
    for target, text in ((marker(root), json.dumps({"url": url, "at": time.time(), "port": port, "pid": os.getpid()})), (runtime.folder(root) / "heartbeat", f"{int(time.time())} {url}\n")):
        write_text(target, text)
    return url


PULSED: dict[str, float] = {}


def pulse(root: Path, port: int) -> None:
    """Writes the heartbeat from a request the server is answering, at most once a second, so a busy server with a starved timer thread still shows it is alive."""
    now = time.time()
    if now - PULSED.get(str(root), 0.0) < PULSE_EVERY:
        return
    PULSED[str(root)] = now
    write_text(runtime.folder(root) / "heartbeat", f"{int(now)} {url_of(port)}\n")


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
        found.extend(URL.findall(runtime.viewer_log(root).read_text())[-1:])
    except OSError:
        pass
    found.extend(url_of(port) for port in PORTS)
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
    return reply is not None and reply.serves(root) and reply.version == version()


def running(root: Path) -> str:
    return next((url for url in candidates(root) if answers(url, root)), "")


def lately_running(root: Path) -> str:
    key, now = str(Path(root).resolve()), time.monotonic()
    if key in SERVING:
        return SERVING[key]
    held = RUNNING.get(key)
    if held is not None and now - held[0] <= RUNNING_FOR:
        return held[1]
    url = running(root)
    RUNNING[key] = (now, url)
    return url


def waited(port: int, seconds: float = PORT_WAIT) -> bool:
    until = time.time() + seconds
    while not free(port):
        if time.time() >= until:
            return False
        time.sleep(0.1)
    return True


def other_journal_on(port: int, root: Path) -> bool:
    reply = identity(url_of(port), 0.3)
    return reply is not None and Path(reply.root).resolve() != root.resolve()


def wait_for(root: Path, port: int) -> float:
    """How long a journal waits for the port it served on: the usual wait, and while its own server is still alive and holds it, until that server has left."""
    was = last(root)
    return OWN_PORT_WAIT if was.port == port and was.pid and alive(was.pid) else PORT_WAIT


def configured(root: Path) -> int:
    """The viewer port the project has set for itself, or 0 when it has set none or one outside the viewer ports."""
    from engine.record import Record
    port = Record(Path(root), runtime.env(Path(root))).viewer.get("port", 0)
    return int(port) if str(port).isdigit() and int(port) in PORTS else 0


def available(root: Path, prefer: int = 0) -> int:
    other = prefer in PORTS and other_journal_on(prefer, root)
    patience = wait_for(root, prefer)
    if prefer in PORTS and not other and waited(prefer, patience):
        return prefer
    if other:
        print(f"journal: port {prefer} is another project's journal now; this viewer moves to a free port", file=sys.stderr)
    elif prefer:
        print(f"journal: port {prefer} is still taken after {patience:g}s; the viewer moves, and a tab left open on it will not reach this journal", file=sys.stderr)
    for port in PORTS:
        if free(port):
            return port
    raise Refused("no viewer port is free from 8420 through 8439: close a journal viewer or another program that uses one of them")


def free_from(start: int) -> int:
    return next((port for port in sorted(PORTS, key=lambda port: (port < start, port)) if free(port)), 0)


def last(root: Path) -> ViewerMark:
    return read_json(marker(root), ViewerMark.from_json, ViewerMark.from_json({}))


def elsewhere(root: Path) -> str:
    from engine.stop import serving
    was = last(root)
    if not was.pid or was.pid == os.getpid() or serving(Path(root)) != was.pid:
        return ""
    until = time.time() + RESTARTING
    while time.time() < until and alive(was.pid):
        reply = identity(was.url, timeout=0.2)
        if reply is not None and reply.serves(root):
            return was.url if reply.version == version() else ""
        time.sleep(0.2)
    return was.url if alive(was.pid) else ""


def start(root: Path, project: Path) -> str:
    return launch(root, project)[0]


def launch(root: Path, project: Path) -> tuple[str, int | None]:
    log = runtime.viewer_log(root)
    log.parent.mkdir(parents=True, exist_ok=True)
    with (runtime.folder(root) / LAUNCHING).open("a") as held:
        fcntl.flock(held, fcntl.LOCK_EX)
        already = running(root) or elsewhere(root)
        if already:
            return already, None
        port = available(root, configured(root) or last(root).port)
        command = [*entry("journal"), "--root", str(root), "serve", "--port", str(port)]
        with log.open("a") as output:
            server = subprocess.Popen(command, cwd=project, stdin=subprocess.DEVNULL, stdout=output, stderr=output, start_new_session=True)
        url, code = answered(root, server)
        if not url and code is None:
            code = stopped(server, log)
        if code is None:
            threading.Thread(target=server.wait, daemon=True).start()
        return url, code


def busy() -> bool:
    return os.getloadavg()[0] > (os.cpu_count() or 1)


def stopped(server: subprocess.Popen, log: Path) -> int:
    server.kill()
    server.wait()
    append_text(log, f"journal: the server did not answer within {COMING_UP:g}s and was stopped\n")
    return STOPPED_BY_US


def answered(root: Path, server: subprocess.Popen) -> tuple[str, int | None]:
    until = time.monotonic() + COMING_UP
    while time.monotonic() < until:
        time.sleep(0.1)
        url = running(root)
        if url:
            return url, None
        if server.poll() is not None:
            return "", server.returncode
    return "", None


def show(url: str, env: str = "", opener=webbrowser.open, focuser=existing_tab) -> str:
    destination = f"{url}#/{env}" if url and env else url
    if destination and not focuser(destination):
        opener(destination)
    return destination


PROBED: list = [0.0, []]
PROBE_FOR = 3.0
PROBE_WAIT = 0.25


def identity_at(port: int):
    return identity(f"http://127.0.0.1:{port}/", PROBE_WAIT)


def probe() -> None:
    with ThreadPoolExecutor(len(PORTS)) as pool:
        PROBED[:] = [time.time(), [(port, got) for port, got in zip(PORTS, pool.map(identity_at, PORTS)) if got]]


def running_journals() -> list:
    if not PROBED[0]:
        probe()
    elif time.time() - PROBED[0] >= PROBE_FOR:
        PROBED[0] = time.time()
        threading.Thread(target=probe, daemon=True).start()
    return PROBED[1]


HEALTH_WAIT = 10.0
MISSES_BEFORE_RESTART = 6
LATE_BEAT = 20.0
PROBER_LOCK = "prober.lock"
STUCK_THREADS = "threads.txt"
STOP_WAIT = 5.0


def healthy(url: str, env: str, timeout: float = HEALTH_WAIT) -> bool:
    try:
        with urlopen(f"{url}api/{env}/health", timeout=timeout) as response:
            return response.status == 200
    except OSError:
        return False


def beat_late(root: Path) -> bool:
    """Whether the server's own heartbeat, written every couple of seconds from a thread of its own, has stopped for long: a server that does not beat is not worth waiting eight seconds on."""
    try:
        written = int((runtime.folder(root) / "heartbeat").read_text().split()[0])
    except (OSError, ValueError, IndexError):
        return False
    return time.time() - written > LATE_BEAT


def take_prober(root: Path):
    """The lock that makes one worker of the journal the one that judges the server, kept for as long as that worker lives; None while another holds it."""
    held = (runtime.folder(root) / PROBER_LOCK).open("a")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        held.close()
        return None
    return held


class StuckServer:
    def __init__(self, root: Path, env: str):
        self.root, self.env, self.missed, self.prober = Path(root), env, 0, None

    def judging(self) -> bool:
        """Only one worker of a journal probes its server, so its answer is asked for once and not once for every environment."""
        if self.prober is None:
            self.prober = take_prober(self.root)
        return self.prober is not None

    def restarted(self) -> str:
        if not self.judging():
            return ""
        url = running(self.root)
        if not url or (not beat_late(self.root) and healthy(url, self.env)):
            self.missed = 0
            return ""
        self.missed += 1
        if self.missed < MISSES_BEFORE_RESTART:
            return ""
        self.missed = 0
        return self.restart(last(self.root).pid)

    def restart(self, pid: int) -> str:
        kept = runtime.folder(self.root) / f"threads-{int(time.time())}.txt"
        os.kill(pid, signal.SIGUSR1)
        time.sleep(1.0)
        dumped = runtime.folder(self.root) / STUCK_THREADS
        if dumped.is_file():
            kept.write_text(dumped.read_text())
        os.kill(pid, signal.SIGTERM)
        until = time.time() + STOP_WAIT
        while time.time() < until and alive(pid):
            time.sleep(0.2)
        if alive(pid):
            os.kill(pid, signal.SIGKILL)
        return str(kept)
