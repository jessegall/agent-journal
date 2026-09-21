import fcntl
import os
import subprocess
import sys
import threading
from pathlib import Path

from engine import typist
from engine.record import Record
from engine.sessions import Sessions
from engine.engine import TICK, Engine
from engine.package import CODE

ENDING = 5.0


class Engines:
    def __init__(self, root: Path, env: str):
        self.root = Path(root)
        self.env = env
        self.parent = os.getppid()
        self.held: dict[str, Engine] = {}

    def seated(self, session: str) -> Engine | None:
        from providers import DRIVERS
        provider = Sessions(self.root).read(session).get("provider", "")
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
            while not stopping.is_set() and not self.owned(held):
                stopping.wait(TICK)
            while not stopping.is_set() and os.getppid() == self.parent:
                self.tick()
                stopping.wait(TICK)

    def owned(self, held) -> bool:
        try:
            fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return True
        except OSError:
            return False


def child(root: str, env: str) -> None:
    Engines(Path(root), env).run(threading.Event())


class Children:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.running: dict[str, subprocess.Popen] = {}

    def wanted(self) -> set[str]:
        sessions = Sessions(self.root)
        return {env for session in typist.live(self.root) if (env := sessions.environment(session))}

    def tick(self) -> None:
        wanted = self.wanted()
        for env, running in list(self.running.items()):
            if env not in wanted or running.poll() is not None:
                self.end(env)
        for env in sorted(wanted - set(self.running)):
            self.running[env] = self.spawn(env)

    def spawn(self, env: str) -> subprocess.Popen:
        log = self.root / "runtime" / f"engine-{env}.log"
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as output:
            return subprocess.Popen([sys.executable, "-c", f"import sys; sys.path.insert(0, {str(CODE)!r}); from engine.engines import child; child(sys.argv[1], sys.argv[2])",
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
            self.tick()
            stopping.wait(TICK)
