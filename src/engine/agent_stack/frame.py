from dataclasses import dataclass
from datetime import datetime

from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.states.state import State


@dataclass(frozen=True)
class Frame:
    """One state instance on an agent's stack, with its need key and when it entered the stack."""

    state: State
    need_key: NeedKey
    entered_at: datetime
