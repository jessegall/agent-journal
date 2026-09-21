import fcntl
from pathlib import Path
from engine import typist
from engine.record import Record
from engine.sessions import Sessions
from engine.engine import TICK, Engine


class Engines:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.held: dict[str, Engine] = {}

    def seated(self, session: str) -> Engine | None:
        from providers import DRIVERS
        sessions = Sessions(self.root)
        provider, env = sessions.read(session).get("provider", ""), sessions.environment(session)
        if provider not in DRIVERS or not env:
            return None
        record = Record(self.root, env)
        engine = Engine(record, DRIVERS[provider](record, session))
        engine.start()
        return engine

    def tick(self) -> None:
        live = typist.live(self.root)
        self.held = {session: engine for session, engine in self.held.items() if session in live}
        for session in live:
            engine = self.held.get(session) or self.seated(session)
            if engine:
                self.held[session] = engine
                engine.step()

    def run(self, stopping) -> None:
        with (self.root / "runtime" / "engines.lock").open("a") as held:
            while not stopping.is_set() and not self.owned(held):
                stopping.wait(TICK)
            while not stopping.is_set():
                self.tick()
                stopping.wait(TICK)

    def owned(self, held) -> bool:
        try:
            fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
            return True
        except OSError:
            return False
