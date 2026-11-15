from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.state import State
from engine.agent_stack.stop_answer import StopAnswer
from engine.enums.stack_level import StackLevel
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class Stack:
    """An agent's frames from the bottom: Stopped, the work lane, the hold lane, then Compacting, Paused and
    Ended."""

    frames: Sequence[StackedState]

    def has(self, state_type: type[State]) -> bool:
        return any(isinstance(frame.state, state_type) for frame in self.frames)

    # the subjects of the frames whose need is no longer among the given keys, which this step takes off the stack
    def subjects_without(self, need_keys: set[StateKey]) -> list[RowReference]:
        return [frame.need_key.subject for frame in self.frames if frame.need_key.subject is not None and frame.need_key not in need_keys]

    def lane(self, lane: StackLevel) -> list[StackedState]:
        return [frame for frame in self.frames if frame.state.lane is lane]

    def work_lane_top(self) -> StackedState:
        return [*self.lane(StackLevel.BOTTOM), *self.lane(StackLevel.WORK)][-1]

    def stop_answer(self, contract: WorkStop, escalation: Escalation | None) -> StopAnswer:
        if self.has(Paused):
            return StopAnswer.safety_rest()
        if self.has(Compacting):
            return StopAnswer.compaction_handoff()
        refusals = [frame.state.stop_refusal() for frame in self.lane(StackLevel.HOLD) if frame.state.refuses_stop(escalation)]
        if refusals:
            return StopAnswer.refusals(refusals)
        top = self.work_lane_top()
        if escalation is not None and escalation.defers_work(top.need_key):
            return StopAnswer.allowed()
        return top.state.stop_answer(contract)
