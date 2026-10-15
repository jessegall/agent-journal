from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.chart.context import Context
from journal.features.chart.walk import Walk
from journal.features.listener import Listener
from journal.models.scoped import Scoped
from journal.repositories.agents import Agents


class WalkRowEvents(Listener[ModelEvent]):
    """Every row created, updated or deleted walks the chart on the worker thread, about the live agent of the row's environment; no hook waits, so a line is typed and nothing is refused."""

    def __init__(self, walk: Walk, agents: Agents) -> None:
        self.walk, self.agents = walk, agents

    def handle(self, event: ModelEvent) -> None:
        if not isinstance(event, (Created, Updated, Deleted)):
            return
        environment_id = event.model.environment_id if isinstance(event.model, Scoped) else 0
        agent = self.agents.live(environment_id) if environment_id else None
        self.walk.on(Context(event=event, session=agent.session if agent else "", environment_id=environment_id, provider=(agent.provider or "claude") if agent else "claude"))
