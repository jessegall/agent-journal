import os
import signal
import socket
import subprocess
import time
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine.fields import number_of, text_of
from engine.keeper import ServiceSpec, ServiceState, gone, teardown
from engine.record import Record
from engine.stored import read_json, write_json
from engine.package import entry

PORTS = range(8440, 8500)
UP, DOWN = "up", "down"
BLOCKED, FAILED = "blocked", "failed"
RESTING = (BLOCKED, FAILED, "stopped", "exited")
BACKOFF = (1.0, 2.0, 4.0, 8.0, 16.0, 30.0)
CRASHES, WITHIN = 5, 60.0


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


@dataclass(frozen=True)
class Wanted:
    want: str = UP
    nonce: float = 0.0

    @classmethod
    def read(cls, root: Path, sid: str) -> "Wanted":
        raw = read_json(want_file(root, sid), {})
        raw = raw if isinstance(raw, dict) else {}
        return cls(text_of(raw, "want") if text_of(raw, "want") else UP, number_of(raw, "nonce"))


def status(root: Path, sid: str) -> ServiceState:
    return ServiceState.read(status_file(root, sid))


def states(root: Path) -> dict[str, ServiceState]:
    home = runtime(root, "")
    found = sorted(home.glob("service-*.json")) if home.is_dir() else []
    return {p.stem.removeprefix("service-"): ServiceState.read(p) for p in found}


def wanted(root: Path, sid: str) -> str:
    return Wanted.read(root, sid).want


def want(root: Path, sid: str, state: str, nonce: float = 0.0) -> dict:
    asked = {"want": state if state in (UP, DOWN) else UP, "nonce": nonce}
    write_json(want_file(root, sid), asked)
    return asked


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
        return (wants, "") if free(wants) or status(root, sid).port == wants else (wants, f"port {wants} is in use")
    before = status(root, sid).port
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
    return [r for r in Plugins(record, actor=SYSTEM)._standing() if r.enabled and r.manifest]


def planned(root: Path, name: str, service, port: int, blocked: str, env: dict, where: Path) -> ServiceSpec:
    sid = f"{name}.{service.name}"
    return ServiceSpec(id=sid, plugin=name, service=service.name, port=port, blocked=blocked, run=service.run, cwd=str(where / service.cwd),
                       env={**env, **service.env}, path=service.ready.path, restart=service.restart, grace=service.grace, show=service.show,
                       lock=str(lock_file(root, sid)), log=str(log_file(root, sid)), status=str(status_file(root, sid)), spec=str(spec_file(root, sid)))


def specs(root: Path) -> list[ServiceSpec]:
    from features.plugins.declared import declared, settings_of
    from features.plugins.manifest import fill
    from features.plugins.source import environment, folder
    out: list[ServiceSpec] = []
    taken: set[int] = set()
    for row in plugins(root):
        manifest = declared(row)
        name = manifest.name
        where = folder(root, name)
        settings = settings_of(row)
        kept = settings.ports
        env = environment(root, name, manifest, row.token, kept, settings.chosen)
        ports = {f"ports.{service}": port for service, port in kept.items()}
        made = []
        for service in manifest.services:
            asked = kept[service.name] if kept.get(service.name) else service.port
            port, blocked = allocate(root, f"{name}.{service.name}", asked, taken) if service.port is not None else (0, "")
            if port:
                taken.add(port)
                ports[f"ports.{service.name}"] = port
            made.append(planned(root, name, service, port, blocked, env, where))
        for spec in made:
            places = {**ports, "port": spec.port, "dir": str(where)}
            out.append(replace(spec, run=fill(spec.run, places), env={key: str(fill(value, places)) for key, value in spec.env.items()},
                               url=f"http://127.0.0.1:{spec.port}" if spec.port else ""))
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


def spawn(spec: ServiceSpec, lifeline: int) -> int:
    replace(ServiceState.read(spec.status), port=spec.port, url=spec.url, owner=os.getpid()).write(spec.status)
    Path(spec.log).parent.mkdir(parents=True, exist_ok=True)
    with open(spec.log, "ab", buffering=0) as log:
        kept = subprocess.Popen([*entry("engine.keeper"), str(lifeline), spec.spec],
                                pass_fds=(lifeline,) if lifeline >= 0 else (), stdin=subprocess.DEVNULL,
                                stdout=log, stderr=log, start_new_session=True)
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
        declared = specs(self.root)
        for spec in declared:
            if self.one(spec):
                started.append(spec.id)
        self.retire({spec.id for spec in declared})
        self.sweep()
        return started

    def retire(self, declared: set[str]) -> list[str]:
        gone_now = [sid for sid in states(self.root) if sid not in declared]
        for sid in gone_now:
            current = status(self.root, sid)
            self.stop(sid, current)
            if current.pgid and not gone(current.pgid):
                teardown(current.pgid, 1.0)
            for place in (status_file, spec_file, want_file, lock_file, log_file):
                place(self.root, sid).unlink(missing_ok=True)
        return gone_now

    def one(self, spec: ServiceSpec) -> bool:
        sid = spec.id
        current = status(self.root, sid)
        asked = Wanted.read(self.root, sid)
        now = self.clock()
        if asked.want == DOWN:
            self.stop(sid, current)
            return False
        if asked.nonce > self.marks.get(sid, 0.0):
            self.marks[sid] = asked.nonce
            self.stop(sid, current)
            self.crashes.pop(sid, None)
            self.waiting.pop(sid, None)
            current = ServiceState()
        if self.living(current.keeper) and current.state not in RESTING:
            return False
        if spec.blocked:
            replace(current, state=BLOCKED, why=spec.blocked, at=now).write(spec.status)
            return False
        if current.state == "exited" and self.seen.get(sid) != current.at:
            self.seen[sid] = current.at
            self.crashed(sid, now)
        if len(self.crashes.get(sid, [])) >= CRASHES:
            replace(current, state=FAILED, why=f"it stopped {CRASHES} times within {WITHIN:g} seconds", at=now).write(spec.status)
            return False
        if self.waiting.get(sid, 0) > now:
            return False
        if spec.restart == "never" and current.state in ("exited", "stopped"):
            return False
        write_json(spec_file(self.root, sid), asdict(replace(spec, owner=os.getpid())))
        keeper = self.start(spec, self.lifeline)
        replace(current, state="starting", keeper=keeper, owner=os.getpid(), port=spec.port, url=spec.url, at=now).write(spec.status)
        return True

    def crashed(self, sid: str, now: float) -> None:
        seen = [at for at in self.crashes.get(sid, []) if now - at < WITHIN] + [now]
        self.crashes[sid] = seen
        self.waiting[sid] = now + BACKOFF[min(len(seen), len(BACKOFF)) - 1]

    def stop(self, sid: str, current: ServiceState) -> None:
        if self.living(current.keeper):
            try:
                os.kill(current.keeper, signal.SIGTERM)
            except (ProcessLookupError, PermissionError):
                pass

    def sweep(self) -> list[int]:
        killed = []
        for sid, current in states(self.root).items():
            group = current.pgid
            if not group or gone(group) or self.living(current.keeper):
                continue
            teardown(group, 1.0)
            killed.append(group)
            replace(current, state="stopped", why="its keeper is gone", at=self.clock()).write(status_file(self.root, sid))
        return killed


def listed(root: Path) -> list[dict]:
    known = {spec.id: spec for spec in specs(root)}
    current = states(root)
    out = []
    for sid in sorted({*known, *current}):
        spec, state = known.get(sid), current.get(sid, ServiceState())
        plugin, _, service = sid.partition(".")
        out.append({"id": sid, "plugin": spec.plugin if spec else plugin, "service": spec.service if spec else service,
                    "state": state.state if state.state else "not running", "why": state.why, "url": spec.url if spec and spec.url else state.url,
                    "port": spec.port if spec and spec.port else state.port, "since": state.started, "declared": spec is not None})
    return out
