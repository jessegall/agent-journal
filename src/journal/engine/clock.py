import threading
import time

from journal.engine.states.ended import Ended
from journal.engine.states_catalogue import StatesCatalogue
from journal.events.agent.ticked import Ticked
from journal.events.clock_ticked import ClockTicked
from journal.events.bus import Bus
from journal.events.decision import Decision
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink


class Clock:
    """A thread that tells the bus Ticked for every live agent, every interval, in that agent's environment, as long as the server runs; what the machine says to a tick is typed in through the supervisor."""

    def __init__(self, agents: Agents, bus: Bus, supervisor: SupervisorLink, scope: Scope, states: StatesCatalogue, interval: float = 5.0) -> None:
        self.agents, self.bus, self.supervisor, self.scope, self.states, self.interval = agents, bus, supervisor, scope, states, interval
        self._stopping = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        self._thread = threading.Thread(target=self._run, name="clock", daemon=True)
        self._thread.start()

    def tick(self) -> None:
        now = time.time()
        self.bus.dispatch(ClockTicked(at=now))
        for agent in self.agents.all():
            if isinstance(self.states.named(agent.state, agent.data), Ended):
                continue
            with self.scope.of(agent.environment_id):
                self._tick(agent, now)

    def _tick(self, agent: Agent, now: float) -> None:
        quiet = now - agent.updated_at.timestamp()
        for answer in self.bus.dispatch(Ticked(session=agent.session, environment_id=agent.environment_id, at=now, quiet_for=quiet)):
            if isinstance(answer, Decision) and answer.context:
                self.supervisor.type(agent.environment_id, answer.context)

    def stop(self) -> None:
        self._stopping.set()
        if self._thread:
            self._thread.join()

    def _run(self) -> None:
        while not self._stopping.wait(self.interval):
            self.tick()
