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
    """An agent's stacked states from the bottom: Stopped, the work lane, the hold lane, then Compacting, Paused and
    Ended."""

    stacked_states: Sequence[StackedState]

    def has(self, state_type: type[State]) -> bool:
        return any(isinstance(stacked_state.state, state_type) for stacked_state in self.stacked_states)

    # the subjects of the stacked states whose need is no longer among the given keys, which this step takes off the stack
    def subjects_without(self, state_keys: set[StateKey]) -> list[RowReference]:
        return [stacked_state.state_key.subject for stacked_state in self.stacked_states if stacked_state.state_key.subject is not None and stacked_state.state_key not in state_keys]

    def lane(self, lane: StackLevel) -> list[StackedState]:
        return [stacked_state for stacked_state in self.stacked_states if stacked_state.state.lane is lane]

    def work_lane_top(self) -> StackedState:
        return [*self.lane(StackLevel.BOTTOM), *self.lane(StackLevel.WORK)][-1]

    def stop_answer(self, contract: WorkStop, escalation: Escalation | None) -> StopAnswer:
        if self.has(Paused):
            return StopAnswer.safety_rest()
        if self.has(Compacting):
            return StopAnswer.compaction_handoff()
        refusals = [stacked_state.state.stop_refusal() for stacked_state in self.lane(StackLevel.HOLD) if stacked_state.state.refuses_stop(escalation)]
        if refusals:
            return StopAnswer.refusals(refusals)
        top = self.work_lane_top()
        if escalation is not None and escalation.defers_work(top.state_key):
            return StopAnswer.allowed()
        return top.state.stop_answer(contract)
