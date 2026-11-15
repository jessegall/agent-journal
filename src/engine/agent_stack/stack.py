from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.need_key import NeedKey
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

    # the subjects of the frames whose need is no longer among the given keys, which this step takes off the stack
    def subjects_without(self, need_keys: set[NeedKey]) -> list[SubjectReference]:
        return [frame.need_key.subject for frame in self.frames if frame.need_key.subject is not None and frame.need_key not in need_keys]

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
        top = self.work_lane_top()
        if escalation is not None and escalation.defers_work(top.need_key):
            return StopAnswer.allowed()
        return top.state.stop_answer(contract)
