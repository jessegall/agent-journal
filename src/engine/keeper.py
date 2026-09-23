import fcntl
import os
import select
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field, fields, replace
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.stored import read_json, write_json  # noqa: E402

TAKEN = 3
WATCH = 0.5
GRACE = 5.0
KILL_AFTER = 2.0
PROBE = 1.0
STARTING, READY, STOPPED, EXITED = "starting", "ready", "stopped", "exited"


def known(cls, raw: dict) -> dict:
    return {f.name: raw[f.name] for f in fields(cls) if f.name in raw}


@dataclass(frozen=True)
class ServiceSpec:
    id: str
    plugin: str
    service: str
    run: object
    lock: str
    log: str
    status: str
    spec: str
    port: int = 0
    blocked: str = ""
    cwd: str = ""
    env: dict = field(default_factory=dict)
    path: str = ""
    restart: str = "on-failure"
    grace: float = GRACE
    show: dict = field(default_factory=dict)
    url: str = ""
    owner: int = 0

    @classmethod
    def from_json(cls, raw: dict) -> "ServiceSpec":
        return cls(**known(cls, raw))


@dataclass(frozen=True)
class ServiceState:
    state: str = ""
    at: float = 0.0
    keeper: int = 0
    pgid: int = 0
    owner: int = 0
    port: int = 0
    url: str = ""
    why: str = ""
    started: float = 0.0
    ready_at: float = 0.0
    last_exit: int = 0

    @classmethod
    def read(cls, path: Path) -> "ServiceState":
        raw = read_json(Path(path), {})
        return cls(**known(cls, raw if isinstance(raw, dict) else {}))

    def write(self, path: Path) -> None:
        write_json(Path(path), asdict(self))


def answers(port: int, path: str) -> bool:
    if not port:
        return True
    if not path:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=PROBE):
                return True
        except OSError:
            return False
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=PROBE) as answered:
            return answered.status < 500
    except urllib.error.HTTPError as answered:
        return answered.code < 500
    except (urllib.error.URLError, OSError, ValueError):
        return False


def gone(group: int) -> bool:
    try:
        os.killpg(group, 0)
    except ProcessLookupError:
        return True
    except PermissionError:
        return False
    return False


def teardown(group: int, grace: float) -> None:
    for sign, waited in ((signal.SIGTERM, grace), (signal.SIGKILL, KILL_AFTER)):
        try:
            os.killpg(group, sign)
        except (ProcessLookupError, PermissionError):
            return
        until = time.monotonic() + waited
        while time.monotonic() < until:
            if gone(group):
                return
            time.sleep(0.05)


def state(spec: ServiceSpec, name: str, child=None, **more) -> None:
    replace(ServiceState.read(spec.status), state=name, at=time.time(), keeper=os.getpid(), pgid=child.pid if child else 0, owner=spec.owner,
            port=spec.port, url=spec.url, **more).write(spec.status)


def lease(spec: ServiceSpec):
    held = open(spec.lock, "a")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        held.close()
        return None
    os.set_inheritable(held.fileno(), False)
    return held


def watch(spec: ServiceSpec, child, lifeline: int, stopping) -> str:
    ready = False
    while child.poll() is None and not stopping[0]:
        seen, _, _ = select.select([lifeline], [], [], WATCH) if lifeline >= 0 else ([], [], [])
        if seen and not os.read(lifeline, 1):
            return STOPPED
        if not ready and answers(spec.port, spec.path):
            ready = True
            state(spec, READY, child, ready_at=time.time())
    return STOPPED if stopping[0] else EXITED


def main(argv: list[str]) -> int:
    lifeline, spec_path = int(argv[0]), Path(argv[1])
    spec = ServiceSpec.from_json(read_json(spec_path, {}))
    held = lease(spec)
    if not held:
        return TAKEN
    stopping = [False]
    signal.signal(signal.SIGTERM, lambda *_: stopping.__setitem__(0, True))
    signal.signal(signal.SIGHUP, signal.SIG_IGN)
    Path(spec.log).parent.mkdir(parents=True, exist_ok=True)
    with open(spec.log, "ab", buffering=0) as log:
        command = spec.run
        child = subprocess.Popen(["/bin/sh", "-c", command] if isinstance(command, str) else list(command),
                                 cwd=spec.cwd if spec.cwd else None, env={**os.environ, **spec.env},
                                 stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        state(spec, STARTING, child, started=time.time())
        ended = watch(spec, child, lifeline, stopping)
        teardown(child.pid, spec.grace)
        state(spec, ended, child, last_exit=child.wait())
    held.close()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
