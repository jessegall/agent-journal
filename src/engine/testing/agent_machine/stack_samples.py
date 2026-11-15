from datetime import UTC, datetime

from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.state import State
from engine.agent_stack.states.stopped import Stopped

SAMPLE_TIME = datetime(2026, 11, 15, tzinfo=UTC)


class StackSamples:
    """Stacks for tests of the machine: Stopped at the bottom, then the given states in order, each with a
    need key of its own."""

    @staticmethod
    def built(*states: State) -> Stack:
        bottom = Stopped(SAMPLE_TIME, "started", True)
        return Stack([StackSamples.stacked_state(bottom, 0), *(StackSamples.stacked_state(state, place) for place, state in enumerate(states, 1))])

    @staticmethod
    def stacked_state(state: State, place: int) -> StackedState:
        return StackedState(state, StateKey(type(state).__name__, None, str(place)), SAMPLE_TIME)
