from dataclasses import dataclass
from datetime import datetime

from engine.agent_stack.state_key import StateKey
from engine.agent_stack.states.state import State


@dataclass(frozen=True)
class StackedState:
    """One state instance on an agent's stack, with its need key and when it entered the stack."""

    state: State
    need_key: StateKey
    entered_at: datetime
