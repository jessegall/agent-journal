from controllers.types import Agents, Triggers
from features.triggers.watching import current
from framework.parts import Context
from framework.sending import Sent
from resources.base import SYSTEM


class TriggersWork:
    """What the triggers feature reads of the journal that no service gives: what a state trigger sees now, through the finders every feature registered."""

    def watching(self, record, trigger: int, agent: int) -> list[Sent]:
        return current(Triggers(record, actor=SYSTEM).peek(trigger), Context.of(self, record), Agents(record, actor=SYSTEM).peek(agent))
