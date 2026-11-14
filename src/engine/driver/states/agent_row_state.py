from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier


class AgentRowState(AgentState):
    """A default state: open for every agent its suite gives it to, standing on the agent's own row from
    its launch, so nothing is written for it and any state pushed later is newer; an agent whose default
    was removed has it closed."""

    tier = StateTier.IN_PLACE

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        if hook.anchor is None or self.name not in hook.defaults:
            return []
        return [hook.anchor]
