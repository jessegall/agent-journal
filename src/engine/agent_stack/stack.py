from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.frame import Frame
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.state import State
from engine.agent_stack.stop_answer import StopAnswer
from engine.enums.lane import Lane
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class Stack:
    """An agent's frames from the bottom: Stopped, the work lane, the hold lane, then Compacting, Paused and
    Ended."""

    frames: Sequence[Frame]

    def has(self, state_type: type[State]) -> bool:
        return any(isinstance(frame.state, state_type) for frame in self.frames)

    def lane(self, lane: Lane) -> list[Frame]:
        return [frame for frame in self.frames if frame.state.lane is lane]

    def work_lane_top(self) -> Frame:
        return [*self.lane(Lane.BOTTOM), *self.lane(Lane.WORK)][-1]

    def stop_answer(self, contract: WorkStop, escalation: Escalation | None) -> StopAnswer:
        if self.has(Paused):
            return StopAnswer.safety_rest()
        if self.has(Compacting):
            return StopAnswer.compaction_handoff()
        refusals = [frame.state.stop_refusal() for frame in self.lane(Lane.HOLD) if frame.state.refuses_stop(escalation)]
        if refusals:
            return StopAnswer.refusals(refusals)
        return self.work_lane_top().state.stop_answer(contract)
