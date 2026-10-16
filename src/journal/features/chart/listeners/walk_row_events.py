from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.chart.catalogue import OWN
from journal.features.chart.context import Context
from journal.engine.machine import Machine
from journal.features.chart.walk import Walk
from journal.features.listener import Listener
from journal.models.scoped import Scoped
from journal.repositories.agents import Agents


class WalkRowEvents(Listener[ModelEvent]):
    """Every row created, updated or deleted walks the chart on the worker thread, about every agent of the row's environment that has not ended, the live one first; no hook waits, so a line is typed, once per environment, and nothing is refused."""

    def __init__(self, walk: Walk, agents: Agents, machine: Machine) -> None:
        self.walk, self.agents, self.machine = walk, agents, machine

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated, Deleted)) or event.model.table() in OWN:
            return
        environment_id = event.model.environment_id if isinstance(event.model, Scoped) else 0
        agents = [a for a in self.agents.in_(environment_id) if a.state != "ended"] if environment_id else []
        if not agents:
            self.walk.on(Context(event=event, environment_id=environment_id))
            return
        spoken: set = set()
        for agent in reversed(agents):
            state = self.machine.states.named(agent.state, agent.data)
            self.walk.on(Context(event=event, session=agent.session, environment_id=environment_id, provider=agent.provider or "claude", spoken=spoken, state=state))
