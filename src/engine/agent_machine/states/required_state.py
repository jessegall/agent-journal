from dataclasses import dataclass

from engine.agent_stack.state_key import StateKey
from engine.agent_stack.states.state import State


@dataclass(frozen=True)
class RequiredState:
    """One state instance a module says belongs on the stack now, with the rank key the driver's rank order
    places it by."""

    state: State
    rank: str
    key: StateKey
