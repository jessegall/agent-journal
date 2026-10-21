import time as timing

from journal.engine.job import Job
from journal.engine.states.ended import Ended
from journal.engine.states_catalogue import StatesCatalogue
from journal.events.agent.ticked import Ticked
from journal.events.clock_ticked import ClockTicked
from journal.events.bus import Bus
from journal.support.decision import Decision
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink


class Clock(Job):
    """The journal's time, and a job that tells the bus Ticked for every live agent every five seconds, in that agent's environment; what the machine says to a tick is typed in through the supervisor."""

    interval_seconds = 5.0

    def __init__(self, agents: Agents, bus: Bus, supervisor: SupervisorLink, scope: Scope, states: StatesCatalogue) -> None:
        self.agents, self.bus, self.supervisor, self.scope, self.states = agents, bus, supervisor, scope, states

    def time(self) -> float:
        return timing.time()

    def tick(self, time: float) -> None:
        self.bus.dispatch(ClockTicked(time=time))
        for agent in self.agents.main_agents():
            if isinstance(self.states.restored(agent.state, agent.data), Ended):
                continue
            with self.scope.environment(agent.environment_id):
                self._tick(agent, time)

    def _tick(self, agent: Agent, time: float) -> None:
        idle_seconds = time - agent.update_time.timestamp()
        self.bus.dispatch(Ticked(session=agent.session, environment_id=agent.environment_id, time=time, silence_seconds=idle_seconds))
