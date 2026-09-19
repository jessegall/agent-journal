import os
import signal
import socket
import subprocess
import sys
import time
from pathlib import Path

from engine.keeper import gone, teardown
from engine.record import Record
from engine.stored import read_json, write_json

PORTS = range(8440, 8500)
UP, DOWN = "up", "down"
BLOCKED, FAILED = "blocked", "failed"
RESTING = (BLOCKED, FAILED, "stopped", "exited")
BACKOFF = (1.0, 2.0, 4.0, 8.0, 16.0, 30.0)
CRASHES, WITHIN = 5, 60.0
KEEPER = Path(__file__).resolve().parent / "keeper.py"


def runtime(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / name


def status_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.json")


def lock_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.lock")


def spec_file(root: Path, sid: str) -> Path:
    return runtime(root, f"spec-{sid}.json")


def want_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.want")


def log_file(root: Path, sid: str) -> Path:
    return runtime(root, f"service-{sid}.log")


def status(root: Path, sid: str) -> dict:
    return read_json(status_file(root, sid), {})


def states(root: Path) -> dict:
    home = runtime(root, "")
    found = sorted(home.glob("service-*.json")) if home.is_dir() else []
    return {p.stem.removeprefix("service-"): read_json(p, {}) for p in found}


def wanted(root: Path, sid: str) -> str:
    return str(read_json(want_file(root, sid), {}).get("want") or UP)


def want(root: Path, sid: str, state: str, nonce: float = 0.0) -> dict:
    said = {"want": state if state in (UP, DOWN) else UP, "nonce": nonce or 0.0}
    write_json(want_file(root, sid), said)
    return said


def free(port: int) -> bool:
    with socket.socket() as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def allocate(root: Path, sid: str, wants, taken: set[int]) -> tuple[int, str]:
    if isinstance(wants, int):
        return (wants, "") if free(wants) or status(root, sid).get("port") == wants else (wants, f"port {wants} is in use")
    before = int(status(root, sid).get("port") or 0)
    if before and before not in taken and free(before):
        return before, ""
    for port in PORTS:
        if port not in taken and free(port):
            return port, ""
    return 0, f"no port free from {PORTS.start} through {PORTS.stop - 1}"


def plugins(root: Path) -> list:
    from controllers.types import Plugins
    from resources.base import SYSTEM
    home = Path(root) / "environments"
    first = sorted(p.name for p in home.iterdir() if p.is_dir()) if home.is_dir() else []
    record = Record(Path(root), first[0] if first else "main")
    return [r for r in Plugins(record, actor=SYSTEM).all() if r.enabled and not r.completed and r.manifest]


def specs(root: Path) -> list[dict]:
    from features.plugins.manifest import fill
    from features.plugins.source import environment, folder
    out: list[dict] = []
    taken: set[int] = set()
    for row in plugins(root):
        name = str(row.manifest.get("name") or "")
        where = folder(root, name)
        kept = (row.settings or {}).get("ports") or {}
        env = environment(root, name, row.manifest, row.token, kept)
        ports = {f"ports.{service}": port for service, port in kept.items()}
        for service, given in (row.manifest.get("services") or {}).items():
            sid = f"{name}.{service}"
            port, blocked = allocate(root, sid, kept.get(service) or given.get("port"), taken) if given.get("port") is not None else (0, "")
            if port:
                taken.add(port)
                ports[f"ports.{service}"] = port
            out.append({"id": sid, "plugin": name, "service": service, "port": port, "blocked": blocked,
                        "run": given["run"], "cwd": str(where / (given.get("cwd") or "")), "env": {**env, **(given.get("env") or {})},
                        "path": str((given.get("ready") or {}).get("path") or ""), "restart": given.get("restart") or "on-failure",
                        "grace": float(given.get("grace") or 5.0), "show": given.get("show") or {},
                        "lock": str(lock_file(root, sid)), "log": str(log_file(root, sid)), "status": str(status_file(root, sid)), "spec": str(spec_file(root, sid))})
        for spec in out:
            if spec["plugin"] != name:
                continue
            places = {**ports, "port": spec["port"], "dir": str(where)}
            spec["run"] = fill(spec["run"], places)
            spec["env"] = {key: str(fill(value, places)) for key, value in spec["env"].items()}
            spec["url"] = f"http://127.0.0.1:{spec['port']}" if spec["port"] else ""
    return out


def alive(pid: int) -> bool:
    if not pid:
        return False
    try:
        os.kill(int(pid), 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def spawn(spec: dict, lifeline: int) -> int:
    write_json(Path(spec["status"]), {**read_json(Path(spec["status"]), {}), **{k: spec[k] for k in ("port", "url")}, "owner": os.getpid()})
    kept = subprocess.Popen([sys.executable, str(KEEPER), str(lifeline), str(spec["spec"])],
                            pass_fds=(lifeline,) if lifeline >= 0 else (), stdin=subprocess.DEVNULL,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    return kept.pid


class Manager:
    def __init__(self, root: Path, lifeline: int = -1, start=spawn, clock=time.time, living=alive):
        self.root = Path(root)
        self.lifeline = lifeline
        self.start = start
        self.clock = clock
        self.living = living
        self.crashes: dict = {}
        self.seen: dict = {}
        self.waiting: dict = {}
        self.marks: dict = {}

    def tick(self) -> list[str]:
        started = []
        for spec in specs(self.root):
            if self.one(spec):
                started.append(spec["id"])
        self.sweep()
        return started

    def one(self, spec: dict) -> bool:
        sid = spec["id"]
        said = status(self.root, sid)
        asked = read_json(want_file(self.root, sid), {})
        now = self.clock()
        if str(asked.get("want") or UP) == DOWN:
            self.stop(sid, said)
            return False
        if float(asked.get("nonce") or 0) > self.marks.get(sid, 0.0):
            self.marks[sid] = float(asked.get("nonce") or 0)
            self.stop(sid, said)
            self.crashes.pop(sid, None)
            self.waiting.pop(sid, None)
            said = {}
        if self.living(said.get("keeper", 0)) and said.get("state") not in RESTING:
            return False
        if spec["blocked"]:
            write_json(Path(spec["status"]), {**said, "state": BLOCKED, "why": spec["blocked"], "at": now})
            return False
        if said.get("state") == "exited" and self.seen.get(sid) != said.get("at"):
            self.seen[sid] = said.get("at")
            self.crashed(sid, now)
        if len(self.crashes.get(sid, [])) >= CRASHES:
            write_json(Path(spec["status"]), {**said, "state": FAILED, "why": f"it stopped {CRASHES} times within {WITHIN:g} seconds", "at": now})
            return False
        if self.waiting.get(sid, 0) > now:
            return False
        if spec["restart"] == "never" and said.get("state") in ("exited", "stopped"):
            return False
        write_json(spec_file(self.root, sid), {**spec, "owner": os.getpid()})
        keeper = self.start(spec, self.lifeline)
        write_json(Path(spec["status"]), {**said, "state": "starting", "keeper": keeper, "owner": os.getpid(), "port": spec["port"], "url": spec["url"], "at": now})
        return True

    def crashed(self, sid: str, now: float) -> None:
        seen = [at for at in self.crashes.get(sid, []) if now - at < WITHIN] + [now]
        self.crashes[sid] = seen
        self.waiting[sid] = now + BACKOFF[min(len(seen), len(BACKOFF)) - 1]

    def stop(self, sid: str, said: dict) -> None:
        if self.living(said.get("keeper", 0)):
            try:
                os.kill(int(said["keeper"]), signal.SIGTERM)
            except (ProcessLookupError, PermissionError):
                pass

    def sweep(self) -> list[int]:
        killed = []
        for sid, said in states(self.root).items():
            group = int(said.get("pgid") or 0)
            if not group or gone(group) or self.living(said.get("keeper", 0)):
                continue
            teardown(group, 1.0)
            killed.append(group)
            write_json(status_file(self.root, sid), {**said, "state": "stopped", "why": "its keeper is gone", "at": self.clock()})
        return killed
