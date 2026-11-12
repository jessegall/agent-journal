from engine.enums.actor_type import ActorType
from engine.event.change import Change
from engine.listener.change_filter import ChangeFilter
from engine.model.model import Model
from engine.listener.rows.event_rows import EventRows
from engine.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice


class DriverChangeFilter(ChangeFilter):
    """A guard a driver lists applies only to changes an agent that driver drives makes, never to a user's;
    every other guard and listener applies to every change."""

    def __init__(self, registry: Registry, rows: EventRows, choice: SuiteChoice) -> None:
        self.registry, self.rows, self.choice = registry, rows, choice

    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        listing = {driver.name for driver in self.registry.drivers if entry_name in driver.guards}
        if not listing:
            return True
        actor = change.context.actor
        if actor.type is not ActorType.AGENT:
            return False
        agent = self.rows.find(Agent, actor.id)
        driver = self.choice.driver(agent.role) if agent is not None else None
        return driver is not None and driver.name in listing
