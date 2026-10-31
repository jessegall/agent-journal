from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.change_filter import ChangeFilter
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice


class DriverChangeFilter(ChangeFilter):
    """A guard a driver lists applies only to changes an agent that driver drives makes, never to a person's; every
    other guard and listener applies to every change."""

    def __init__(self, registry: Registry, queries: Queries, choice: SuiteChoice) -> None:
        self.registry, self.queries, self.choice = registry, queries, choice

    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        listing = {driver.name for driver in self.registry.drivers if entry_name in driver.guards}
        if not listing:
            return True
        actor = change.context.actor
        if actor.type is not ActorType.AGENT:
            return False
        agents = self.queries.query(Agent).filter(id=actor.id).page(1, 1).rows
        driver = self.choice.driver(agents[0].environment_id, agents[0].role) if agents else None
        return driver is not None and driver.name in listing
