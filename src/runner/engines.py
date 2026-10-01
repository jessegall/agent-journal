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
from engine.seats import seats
from engine.sessions import Sessions
from controllers.faults import threw
from controllers.types import Messages, Notices
from resources.base import SYSTEM, USER
from runner.engine import TICK, Engine
from engine.package import CODE, ZIPPED

ENDING = 5.0
UNHEARD_AFTER = 120.0
LOOKED_EVERY = 30.0
CHILD = "import commands.cli; from runner.engines import child"


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
        return [session for session in typist.live(self.root) if sessions.environment(session) == self.env]

    def tick(self) -> None:
        mine = self.mine()
        self.held = {session: engine for session, engine in self.held.items() if session in mine}
        for session in mine:
            engine = self.held.get(session) or self.seated(session)
            if engine:
                self.held[session] = engine
                engine.step()

    def run(self, stopping) -> None:
        with (self.root / "runtime" / f"engines-{self.env}.lock").open("a") as held:
            while not stopping.is_set() and current(self.root) and not self.owned(held):
                stopping.wait(TICK)
            while not stopping.is_set() and os.getppid() == self.parent and current(self.root):
                try:
                    self.tick()
                except Exception:
                    threw(self.root, self.env, f"the engines of {self.env}")
                stopping.wait(TICK)

    def owned(self, held) -> bool:
        try:
            fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return True
        except OSError:
            return False


def current(root: Path) -> bool:
    return not ZIPPED or (Path(root) / "journal.pyz").resolve() == CODE


def leftovers(root: Path) -> list[int]:
    listed = subprocess.run(["ps", "-eo", "pid=,command="], capture_output=True, text=True, timeout=5).stdout
    return [int(line.split(None, 1)[0]) for line in listed.splitlines()
            if CHILD in line and str(root) in line and repr(str(CODE)) not in line]


def child(root: str, env: str) -> None:
    Engines(Path(root), env).run(threading.Event())


class Children:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.running: dict[str, subprocess.Popen] = {}
        self.alarmed: set[str] = set()
        self.looked = 0.0
        for pid in leftovers(self.root):
            try:
                os.kill(pid, signal.SIGTERM)
            except OSError:
                continue

    def wanted(self) -> set[str]:
        sessions = Sessions(self.root)
        seated = {seat.terminal: seat.env for seat in seats(self.root)}
        return {env for session in typist.live(self.root) if (env := sessions.environment(session) or self.healed(sessions, session, seated))}

    def healed(self, sessions: Sessions, session: str, seated: dict[str, str]) -> str | None:
        found = sessions.read(session)
        if session not in seated or found.evicted_since_start:
            return None
        sessions.write(session, environment=seated[session])
        return seated[session]

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
        waiting = [row["n"] for row in messages.summaries() if not row["deleted"] and not row["completed"] and "agent" not in row["seen"]
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
        log = self.root / "runtime" / f"engine-{env}.log"
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as output:
            return subprocess.Popen([sys.executable, "-c", f"import sys; sys.path.insert(0, {str(CODE)!r}); {CHILD}; child(sys.argv[1], sys.argv[2])",
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
        for env in list(self.running):
            self.end(env)

    def run(self, stopping) -> None:
        while not stopping.is_set():
            try:
                self.tick()
            except Exception:
                threw(self.root, runtime.env(self.root), "starting the engines")
            stopping.wait(TICK)
