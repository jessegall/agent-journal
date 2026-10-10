import fcntl
import os
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

from engine import runtime, typist
from engine.record import Record
from engine.seats import read_seat
from engine.sessions import Sessions
from controllers.faults import threw
from controllers.types import Messages, Notices
from resources.base import AGENT, SYSTEM, USER
from runner.engine import TICK, Engine
from engine.package import CODE, ZIPPED, build_file
from engine.locks import claim
from engine.sampling import profile_when_asked

ENDING = 5.0
UNHEARD_AFTER = 120.0
LOOKED_EVERY = 30.0
LIVE_EVERY = 2.0
CHILD = "import commands.cli; from runner.engines import child"

SUPERVISING = "engines-supervisor.lock"


def always() -> bool:
    return True


def keep_ticking(stopping, tick, fault, going=always) -> None:
    while not stopping.is_set() and going():
        try:
            tick()
        except Exception:
            fault()
        stopping.wait(TICK)


class Engines:
    def __init__(self, root: Path, env: str):
        self.root = Path(root)
        self.env = env
        self.parent = os.getppid()
        self.held: dict[str, Engine] = {}

    def seated(self, session: str) -> Engine | None:
        from providers import DRIVERS
        provider = Sessions(self.root).read(session).provider
        if provider not in DRIVERS:
            return None
        record = Record(self.root, self.env)
        engine = Engine(record, DRIVERS[provider](record, session))
        engine.start()
        return engine

    def mine(self) -> list[str]:
        sessions = Sessions(self.root)
        return [session for session in typist.listed(self.root) if sessions.environment(session) == self.env]

    def tick(self) -> None:
        mine = self.mine()
        self.held = {session: engine for session, engine in self.held.items() if session in mine}
        for session in mine:
            engine = self.held.get(session) or self.seated(session)
            if engine:
                self.held[session] = engine
                engine.step()

    def run(self, stopping) -> None:
        with (runtime.folder(self.root) / f"engines-{self.env}.lock").open("a") as held:
            while not stopping.is_set() and self.going() and not self.owned(held):
                stopping.wait(TICK)
            keep_ticking(stopping, self.tick, lambda: threw(self.root, self.env, f"the engines of {self.env}"), self.going)

    def going(self) -> bool:
        return os.getppid() == self.parent and current(self.root)

    def owned(self, held) -> bool:
        try:
            fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return True
        except OSError:
            return False


def current(root: Path) -> bool:
    return not ZIPPED or build_file(root) == CODE


def installed(root: Path) -> Path:
    """The build an engine is started from: the installed one, so an engine never starts on a build that would make it stop at once."""
    return build_file(root) if ZIPPED else CODE


def leftovers(root: Path) -> list[int]:
    listed = subprocess.run(["ps", "-eo", "pid=,command="], capture_output=True, text=True, timeout=5).stdout
    return [int(line.split(None, 1)[0]) for line in listed.splitlines()
            if CHILD in line and str(root) in line and repr(str(installed(root))) not in line]


def child(root: str, env: str) -> None:
    profile_when_asked(Path(root), env)
    Engines(Path(root), env).run(threading.Event())


class Children:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.running: dict[str, subprocess.Popen] = {}
        self.alarmed: set[str] = set()
        self.looked = 0.0
        self.found: list[str] = []
        self.found_at = 0.0
        for pid in leftovers(self.root):
            try:
                os.kill(pid, signal.SIGTERM)
            except OSError:
                continue

    def wanted(self) -> set[str]:
        sessions = Sessions(self.root)
        if time.time() - self.found_at >= LIVE_EVERY:
            self.found, self.found_at = typist.publish_live(self.root), time.time()
        return {env for session in self.found if (env := sessions.environment(session) or self.healed(sessions, session))}

    def healed(self, sessions: Sessions, session: str) -> str | None:
        seat = read_seat(self.root, session)
        if not seat.env or sessions.read(session).evicted_since_start:
            return None
        sessions.write(session, environment=seat.env)
        return seat.env

    def tick(self) -> None:
        wanted = self.wanted()
        for env, running in list(self.running.items()):
            if env not in wanted or running.poll() is not None:
                self.end(env)
        for env in sorted(wanted - set(self.running)):
            self.running[env] = self.spawn(env)
        if time.time() - self.looked >= LOOKED_EVERY:
            self.looked = time.time()
            for env in sorted(wanted & set(self.running)):
                self.unheard(env)

    def unheard(self, env: str) -> None:
        record = Record(self.root, env)
        messages = Messages(record, actor=SYSTEM)
        waiting = [row["n"] for row in messages.rows.standing_summaries() if AGENT not in row["seen"]
                   and f"{env}:{row['n']}" not in self.alarmed]
        for row in [messages.load(n) for n in waiting]:
            if row.seen[:1] != [USER] or row.data.get("delivered") or time.time() - row.created < UNHEARD_AFTER:
                continue
            self.alarmed.add(f"{env}:{row.n}")
            Notices(record, actor=SYSTEM).create(f"Message {row.n} has not reached the agent", tone="warn",
                                                 brief=f"It waited {int((time.time() - row.created) // 60)} minutes; the agent's engine is restarted to deliver it.")
            self.end(env)
            return

    def spawn(self, env: str) -> subprocess.Popen:
        log = runtime.folder(self.root) / f"engine-{env}.log"
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as output:
            return subprocess.Popen([sys.executable, "-c", f"import sys; sys.path.insert(0, {str(installed(self.root))!r}); {CHILD}; child(sys.argv[1], sys.argv[2])",
                                     str(self.root), env], cwd=self.root.parent, stdin=subprocess.DEVNULL, stdout=output, stderr=output)

    def end(self, env: str) -> None:
        running = self.running.pop(env)
        if running.poll() is None:
            running.terminate()
            try:
                running.wait(timeout=ENDING)
            except subprocess.TimeoutExpired:
                running.kill()

    def stop(self) -> None:
        for running in self.running.values():
            if running.poll() is None:
                running.terminate()
        for env in list(self.running):
            self.end(env)

    def run(self, stopping) -> None:
        keep_ticking(stopping, self.tick, lambda: threw(self.root, runtime.env(self.root), "starting the engines"), lambda: current(self.root))


def supervise(root: Path, stopping) -> None:
    while not stopping.is_set():
        held = claim(runtime.folder(root) / SUPERVISING) if current(root) else None
        if held is None:
            stopping.wait(TICK)
            continue
        with held:
            children = Children(root)
            try:
                children.run(stopping)
            finally:
                children.stop()
