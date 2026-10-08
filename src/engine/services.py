import os
import signal
import subprocess
import time
import uuid
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from engine.fields import Loaded
from engine.keeper import BUILD, ServiceSpec, ServiceState, gone, teardown
from engine.stored import read_json, write_json
from engine.locks import claim
from engine.package import ARCHIVE, entry
from engine.ports import free, reserve
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
KEEPING = "services-keeper.lock"
BEATING = "services-keeper.beat"
STALE_AFTER = 30.0
CRASHES, WITHIN = 5, 300.0
BOOTING = 10.0


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


def beat_file(root: Path) -> Path:
    return folder(root) / BEATING


@dataclass(frozen=True)
class Beat(Loaded):
    token: str = ""
    at: float = 0.0

    @classmethod
    def read(cls, root: Path) -> "Beat":
        return read_json(beat_file(root), cls.from_json, cls.from_json({}))

    def write(self, root: Path) -> None:
        write_json(beat_file(root), asdict(self))


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
    if held.port and held.port not in taken and (free(held.port) or alive(held.keeper)):
        return held.port, ""
    for port in PORTS:
        if port not in taken and free(port) and reserve(port, f"{root}:{sid}"):
            return port, ""
    return 0, f"no port free from {PORTS[0]} through {PORTS[-1]}"


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


def ignore(where: str) -> None:
    return None


def gather(root: Path, sources, faulted=ignore) -> tuple[list[ServiceSpec], bool]:
    taken: set[int] = set()
    found: list[ServiceSpec] = []
    complete = True
    for source in (*sources, *SOURCES.each(Record(root, env(root)))):
        try:
            found.extend(source(root, taken))
        except Exception:
            complete = False
            faulted(f"the services of {getattr(source, '__name__', source)}")
    return found, complete


def specs(root: Path, sources) -> list[ServiceSpec]:
    return gather(root, sources)[0]


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
    def __init__(self, root: Path, lifeline: int = -1, start=spawn, clock=time.time, living=alive, sources=(), faulted=ignore):
        self.root = Path(root)
        self.sources = sources
        self.faulted = faulted
        self.lifeline = lifeline
        self.start = start
        self.clock = clock
        self.living = living
        self.crashes: dict = {}
        self.seen: dict = {}
        self.waiting: dict = {}
        self.needed: dict = {}
        self.owned = None
        self.token = uuid.uuid4().hex
        self.leading = False

    def leads(self) -> bool:
        now = self.clock()
        beat = Beat.read(self.root)
        fresh = now - beat.at < STALE_AFTER
        if self.leading and beat.token != self.token and fresh:
            self.leading = False
            return False
        newly = self.owned is None
        self.owned = self.owned or claim(folder(self.root) / KEEPING)
        mine, lapsed = beat.token == self.token, beat.token != self.token and not fresh
        if mine or lapsed or (newly and self.owned is not None):
            Beat(self.token, now).write(self.root)
            self.leading = True
        return self.leading

    def tick(self) -> list[str]:
        if not self.leads():
            return []
        started = []
        declared, complete = gather(self.root, self.sources, self.faulted)
        for spec in declared:
            if self.one(spec):
                started.append(spec.id)
        if complete:
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
            self.needed.pop(sid, None)
            current = ServiceState(nonce=asked.nonce)
            current.write(spec.status)
        unneeded = spec.idle or self.unneeded(spec, now)
        if unneeded:
            self.stop(sid, current)
            replace(current, state=NOT_NEEDED, why=unneeded, at=now).write(spec.status)
            return False
        if self.living(current.keeper) and current.state not in RESTING:
            return False
        if spec.blocked:
            replace(current, state=BLOCKED, why=spec.blocked, at=now).write(spec.status)
            return False
        if self.booting(current, now):
            return False
        if self.died(current, now) and self.seen.get(sid) != current.at:
            self.seen[sid] = current.at
            self.crashed(sid, now)
        stops = len(self.crashes.get(sid, []))
        if stops >= CRASHES and current.state != FAILED:
            replace(current, state=FAILED, why=f"it stopped {stops} times within {WITHIN:g} seconds and is tried again every {self.wait_after(stops):g} seconds at most", at=now).write(spec.status)
        if self.waiting.get(sid, 0) > now:
            return False
        if spec.restart == "never" and current.state in ("exited", "stopped"):
            return False
        write_json(spec_file(self.root, sid), asdict(replace(spec, owner=os.getpid())))
        replace(current, state="starting", keeper=0, owner=os.getpid(), port=spec.port, url=spec.url, at=now).write(spec.status)
        kept = self.start(spec, self.lifeline)
        started = status(self.root, sid)
        if kept and started.state == "starting" and not started.keeper:
            replace(started, keeper=kept).write(spec.status)
        return True

    def booting(self, current: ServiceState, now: float) -> bool:
        return current.state == "starting" and not current.keeper and now - current.at <= BOOTING

    def died(self, current: ServiceState, now: float) -> bool:
        if current.state == "exited":
            return True
        return current.state == "starting" and not self.living(current.keeper)

    def unneeded(self, spec: ServiceSpec, now: float) -> str:
        if not spec.when:
            return ""
        asked, why = self.needed.get(spec.id, (0.0, ""))
        if now - asked < NEEDED_FOR:
            return why
        try:
            ran = subprocess.run(spec.when, shell=True, cwd=self.root.parent, env={**os.environ, **spec.env}, capture_output=True, text=True, timeout=ASKED_WITHIN)
            why = "" if ran.returncode == 0 else f"not needed here: {spec.when} answered {ran.returncode}{excerpt(ran.stdout)}"
        except (OSError, subprocess.SubprocessError) as e:
            why = f"not needed here: {spec.when} could not be asked ({e})"
        self.needed[spec.id] = (now, why)
        return why

    def crashed(self, sid: str, now: float) -> None:
        seen = [at for at in self.crashes.get(sid, []) if now - at < WITHIN] + [now]
        self.crashes[sid] = seen
        self.waiting[sid] = now + self.wait_after(len(seen))

    def wait_after(self, stops: int) -> float:
        return BACKOFF[min(stops, len(BACKOFF)) - 1]

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
