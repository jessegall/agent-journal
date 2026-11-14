from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState, StateTier
from engine.driver.open_row import OpenRow


class Overlay(AgentState):
    """The base of every overlay: an agent state whose open rows put its rules before the driver's; an exclusive one
    silences every ordinary rule beneath it, and one that delays notices also silences the rules that only tell the
    agent something. An exclusive one that lets wakes through leaves a rule that wakes a stopped agent speaking,
    since an agent asleep at its prompt cannot do what the overlay waits for. One that pauses the agent also
    silences the rules that yield to a pause, though they speak under any other overlay."""

    tier = StateTier.STACK

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return self.open_agent_rows(hook.agent_id)

    def open_agent_rows(self, agent_id: int) -> Sequence[OpenRow]:
        raise NotImplementedError
