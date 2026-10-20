from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.support.chart_catalogue import OWN
from journal.features.chart.support.context import Context
from journal.engine.machine import Machine
from journal.engine.states.ended import Ended
from journal.features.chart.support.walk import Walk
from journal.events.listener import Listener
from journal.models.scoped import Scoped
from journal.repositories.agents import Agents


class WalkRowEvents(Listener[ModelEvent]):
    """Every row created, updated or deleted walks the chart on the worker thread, in the row's environment, which the feature's switch puts it in, about every agent there that has not ended, the live one first; no hook waits, so a line is typed and a value set once per environment, and nothing is refused."""

    def __init__(self, walk: Walk, agents: Agents, machine: Machine) -> None:
        self.walk, self.agents, self.machine = walk, agents, machine

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated, Deleted)) or event.model.table() in OWN:
            return
        environment_id = event.model.environment_id if isinstance(event.model, Scoped) else 0
        agents = [a for a in self.agents.in_() if not isinstance(self.machine.states.named(a.state, a.data), Ended)] if environment_id else []
        if not agents:
            self.walk.on(Context(event=event, environment_id=environment_id))
            return
        spoken, valued = set(), set()
        for agent in reversed(agents):
            state = self.machine.states.named(agent.state, agent.data)
            self.walk.on(Context(event=event, session=agent.session, environment_id=environment_id, provider=agent.provider or "claude", spoken=spoken, valued=valued, state=state))
