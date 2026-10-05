import os
import signal
import subprocess
import time
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine.fields import Loaded
from engine.keeper import BUILD, ServiceSpec, ServiceState, gone, teardown
from engine.stored import read_json, write_json
from engine.package import ARCHIVE, entry
from engine.ports import free
from engine.runtime import env, folder
from engine.sessions import alive
from typing import TypedDict
from engine.extension import Extension
from engine.record import Record

PORTS = range(8440, 8500)
UP, DOWN = "up", "down"
BLOCKED, FAILED, NOT_NEEDED = "blocked", "failed", "not needed"
RESTING = (BLOCKED, FAILED, NOT_NEEDED, "stopped", "exited")
NEEDED_FOR = 600.0
ASKED_WITHIN = 10.0
BACKOFF = (1.0, 2.0, 4.0, 8.0, 16.0, 30.0)
KEEPER_EXIT = 3.0
CRASHES, WITHIN = 5, 60.0


def status_file(root: Path, sid: str) -> Path:
    return folder(root) / f"service-{sid}.json"


def holder(root: Path, sid: str) -> int:
    try:
        said = lock_file(root, sid).read_text().strip()
    except OSError:
        return 0
    return int(said) if said.isdigit() else 0


def lock_file(root: Path, sid: str) -> Path:
    return folder(root) / f"service-{sid}.lock"


def current_build(root: Path) -> str:
    return (Path(root) / ARCHIVE).resolve().name


def spec_file(root: Path, sid: str) -> Path:
    return folder(root) / f"spec-{sid}.json"


def want_file(root: Path, sid: str) -> Path:
    return folder(root) / f"service-{sid}.want"


def log_file(root: Path, sid: str) -> Path:
    return folder(root) / f"service-{sid}.log"


@dataclass(frozen=True)
class Wanted(Loaded):
    want: str = UP
    nonce: float = 0.0

    @classmethod
    def read(cls, root: Path, sid: str) -> "Wanted":
        return read_json(want_file(root, sid), cls.from_json, cls.from_json({}))


def status(root: Path, sid: str) -> ServiceState:
    return ServiceState.read(status_file(root, sid))


def states(root: Path) -> dict[str, ServiceState]:
    home = folder(root)
    found = sorted(home.glob("service-*.json")) if home.is_dir() else []
    return {p.stem.removeprefix("service-"): ServiceState.read(p) for p in found}


def wanted(root: Path, sid: str) -> str:
    return Wanted.read(root, sid).want


def want(root: Path, sid: str, state: str, nonce: float = 0.0) -> dict:
    asked = {"want": state if state in (UP, DOWN) else UP, "nonce": nonce}
    write_json(want_file(root, sid), asked)
    return asked


def allocate(root: Path, sid: str, wants, taken: set[int]) -> tuple[int, str]:
    if isinstance(wants, int):
        return (wants, "") if free(wants) else (wants, f"port {wants} is in use")
    held = status(root, sid)
    if held.port and held.port not in taken and free(held.port):
        return held.port, ""
    for port in PORTS:
        if port not in taken and free(port):
            return port, ""
    return 0, f"no port free from {PORTS.start} through {PORTS.stop - 1}"


def claimed(root: Path, sid: str, wants, taken: set[int]) -> tuple[int, str]:
    port, blocked = allocate(root, sid, wants, taken)
    if port:
        taken.add(port)
    return port, blocked


def local_url(port: int) -> str:
    return f"http://127.0.0.1:{port}" if port else ""


SOURCES = Extension()


class ServiceFiles(TypedDict):
    lock: str
    log: str
    status: str
    spec: str


def files_for(root: Path, sid: str) -> ServiceFiles:
    return {"lock": str(lock_file(root, sid)), "log": str(log_file(root, sid)), "status": str(status_file(root, sid)), "spec": str(spec_file(root, sid))}


def service_spec(root: Path, sid: str, **fields) -> ServiceSpec:
    return ServiceSpec(id=sid, **fields, **files_for(root, sid))


def specs(root: Path, sources) -> list[ServiceSpec]:
    taken: set[int] = set()
    return [spec for source in (*sources, *SOURCES.each(Record(root, env(root)))) for spec in source(root, taken)]


def spawn(spec: ServiceSpec, lifeline: int) -> int:
    replace(ServiceState.read(spec.status), port=spec.port, url=spec.url, owner=os.getpid()).write(spec.status)
    Path(spec.log).parent.mkdir(parents=True, exist_ok=True)
    with open(spec.log, "ab", buffering=0) as log:
        kept = subprocess.Popen([*entry("engine.keeper"), str(lifeline), spec.spec],
                                pass_fds=(lifeline,) if lifeline >= 0 else (), stdin=subprocess.DEVNULL,
                                stdout=log, stderr=log, start_new_session=True)
    return kept.pid


def excerpt(output: str) -> str:
    words = output.strip()[:160]
    return f": {words}" if words else ""


class Manager:
    def __init__(self, root: Path, lifeline: int = -1, start=spawn, clock=time.time, living=alive, sources=()):
        self.root = Path(root)
        self.sources = sources
        self.lifeline = lifeline
        self.start = start
        self.clock = clock
        self.living = living
        self.crashes: dict = {}
        self.seen: dict = {}
        self.waiting: dict = {}
        self.needed: dict = {}

    def tick(self) -> list[str]:
        started = []
        declared = specs(self.root, self.sources)
        for spec in declared:
            if self.one(spec):
                started.append(spec.id)
        self.retire({spec.id for spec in declared})
        self.sweep()
        return started

    def retire(self, declared: set[str]) -> list[str]:
        gone_now = [sid for sid in states(self.root) if sid not in declared]
        for sid in gone_now:
            self.remove(sid)
            want_file(self.root, sid).unlink(missing_ok=True)
        return gone_now

    def remove(self, sid: str) -> None:
        current = status(self.root, sid)
        self.stop(sid, current)
        stray = holder(self.root, sid)
        if stray != current.keeper:
            self.stop(sid, replace(current, keeper=stray))
        if current.pgid and not gone(current.pgid):
            teardown(current.pgid, 1.0)
        until = time.monotonic() + KEEPER_EXIT
        while (self.living(current.keeper) or self.living(stray)) and time.monotonic() < until:
            time.sleep(0.05)
        for place in (status_file, spec_file, lock_file, log_file):
            place(self.root, sid).unlink(missing_ok=True)

    def stored_build(self, sid: str) -> str:
        stored = read_json(spec_file(self.root, sid), ServiceSpec.from_json, None)
        return stored.build if stored is not None else ""

    def one(self, spec: ServiceSpec) -> bool:
        sid = spec.id
        current = status(self.root, sid)
        stray = holder(self.root, sid)
        if not self.living(current.keeper) and self.living(stray):
            current = replace(current, keeper=stray)
            current.write(spec.status)
        if self.living(current.keeper) and (current.build or self.stored_build(sid)) != spec.build:
            self.remove(sid)
            current = status(self.root, sid)
        asked = Wanted.read(self.root, sid)
        now = self.clock()
        if asked.want == DOWN:
            self.stop(sid, current)
            return False
        if asked.nonce > current.nonce:
            self.remove(sid)
            self.crashes.pop(sid, None)
            self.waiting.pop(sid, None)
            current = ServiceState(nonce=asked.nonce)
            current.write(spec.status)
        if self.living(current.keeper) and current.state not in RESTING:
            return False
        if spec.blocked:
            replace(current, state=BLOCKED, why=spec.blocked, at=now).write(spec.status)
            return False
        unneeded = self.unneeded(spec, now)
        if unneeded:
            replace(current, state=NOT_NEEDED, why=unneeded, at=now).write(spec.status)
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
        replace(current, state="starting", keeper=0, owner=os.getpid(), port=spec.port, url=spec.url, at=now).write(spec.status)
        self.start(spec, self.lifeline)
        return True

    def unneeded(self, spec: ServiceSpec, now: float) -> str:
        if not spec.when:
            return ""
        asked, why = self.needed.get(spec.id, (0.0, ""))
        if now - asked < NEEDED_FOR:
            return why
        try:
            ran = subprocess.run(spec.when, shell=True, cwd=spec.cwd or None, env={**os.environ, **spec.env}, capture_output=True, text=True, timeout=ASKED_WITHIN)
            why = "" if ran.returncode == 0 else f"not needed here: {spec.when} answered {ran.returncode}{excerpt(ran.stdout)}"
        except (OSError, subprocess.SubprocessError) as e:
            why = f"not needed here: {spec.when} could not be asked ({e})"
        self.needed[spec.id] = (now, why)
        return why

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


def listed(root: Path, sources) -> list[dict]:
    known = {spec.id: spec for spec in specs(root, sources)}
    current = states(root)
    out = []
    for sid in sorted({*known, *current}):
        spec, state = known.get(sid), current.get(sid, ServiceState())
        plugin, _, service = sid.partition(".")
        out.append({"id": sid, "plugin": spec.plugin if spec else plugin, "service": spec.service if spec else service,
                    "state": state.state if state.state else "not running", "why": state.why, "url": spec.url if spec and spec.url else state.url,
                    "port": spec.port if spec and spec.port else state.port, "since": state.started, "declared": spec is not None})
    return out
