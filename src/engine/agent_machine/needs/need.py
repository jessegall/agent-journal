from dataclasses import dataclass

from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.states.state import State


@dataclass(frozen=True)
class Need:
    """One state instance a module says belongs on the stack now, with the rank key the driver's rank order places it by."""

    state: State
    rank: str
    key: NeedKey
