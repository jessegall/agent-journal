from datetime import UTC, datetime

from engine.agent_stack.frame import Frame
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.state import State
from engine.agent_stack.states.stopped import Stopped

SAMPLE_MOMENT = datetime(2026, 11, 15, tzinfo=UTC)


class StackSamples:
    """Stacks for tests of the machine: Stopped at the bottom, then the given states in order, each with a need key of its own."""

    @staticmethod
    def built(*states: State) -> Stack:
        bottom = Stopped(SAMPLE_MOMENT, "started", True)
        return Stack([StackSamples.frame(bottom, 0), *(StackSamples.frame(state, place) for place, state in enumerate(states, 1))])

    @staticmethod
    def frame(state: State, place: int) -> Frame:
        return Frame(state, NeedKey(type(state).__name__, None, str(place)), SAMPLE_MOMENT)
