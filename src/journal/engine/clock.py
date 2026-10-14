import threading
import time

from journal.engine.states.ended import Ended
from journal.events.agent.ticked import Ticked
from journal.events.clock_ticked import ClockTicked
from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class Clock:
    """A thread that tells the bus Ticked for every live agent, every interval, as long as the server runs; what the machine says to a tick is typed in through the supervisor."""

    def __init__(self, agents: Agents, bus: Bus, supervisor: SupervisorLink, interval: float = 5.0) -> None:
        self.agents, self.bus, self.supervisor, self.interval = agents, bus, supervisor, interval
        self._stopping = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name="clock", daemon=True)
        self._thread.start()

    def tick(self) -> None:
        now = time.time()
        self.bus.dispatch(ClockTicked(at=now))
        for agent in self.agents.all():
            if agent.state == Ended.name:
                continue
            quiet = now - agent.updated_at.timestamp()
            for answer in self.bus.dispatch(Ticked(session=agent.session, environment_id=agent.environment_id, at=now, quiet_for=quiet)):
                if isinstance(answer, Decision) and answer.context:
                    self.supervisor.type(answer.context)

    def stop(self) -> None:
        self._stopping.set()
        if self._thread:
            self._thread.join()

    def _run(self) -> None:
        while not self._stopping.wait(self.interval):
            self.tick()
