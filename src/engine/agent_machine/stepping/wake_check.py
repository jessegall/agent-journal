from collections.abc import Sequence

from engine.agent_stack.stack import Stack
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.working import Working
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.wake_cause import WakeCause
from engine.agent_machine.record.wake_change import WakeChange
from engine.enums.stack_level import StackLevel
from engine.enums.stop_answer_type import StopAnswerType
from engine.enums.wake_move import WakeMove
from engine.enums.work_stop import WorkStop

STOP_CAUSE = "drivers.stop-refused"
JOB_CAUSE = "drivers.job-open"


class WakeCheck:
    """Whether a step writes the agent's wake obligation (doc 1310 section 6.4): a resting agent that needs
    attention, because a stop asked now would be refused, its own job is on top of a hand-in driver's work
    lane, or a declared wake cause is due; inhibited while it is Paused or Compacting."""

    def __init__(self, causes: Sequence[WakeCause]) -> None:
        self.causes = causes

    def change(self, view: AgentView, stack: Stack) -> WakeChange:
        causes = self.attention(view, stack) if view.is_resting else [cause.key for cause in self.causes if cause.wakes_mid_turn and cause.requires_wake(view)]
        if not causes:
            return WakeChange.unchanged()
        # an open escalation waits for its responder's answer, which wakes the agent itself (doc 1310 sections 3.1 and 6.4)
        is_inhibited = stack.has(Paused) or stack.has(Compacting) or view.escalation is not None
        move = WakeMove.INHIBITED if is_inhibited else WakeMove.RECORDED
        return WakeChange(move, self.work_number(stack), tuple(causes))

    def attention(self, view: AgentView, stack: Stack) -> list[str]:
        work = Stack([stacked_state for stacked_state in stack.stacked_states if stacked_state.state.level is not StackLevel.SAFETY])
        causes = [STOP_CAUSE] if work.stop_answer(view.work_stop, view.escalation).answer_type is StopAnswerType.REFUSED else []
        if self.has_open_job(view, stack):
            causes.append(JOB_CAUSE)
        return [*causes, *(cause.key for cause in self.causes if not cause.wakes_mid_turn and cause.requires_wake(view) and not cause.is_inhibited(view))]

    @staticmethod
    def has_open_job(view: AgentView, stack: Stack) -> bool:
        top = stack.work_level_top().state
        return view.work_stop is WorkStop.JOB_REPORT and isinstance(top, Working) and top.work.is_job()

    @staticmethod
    def work_number(stack: Stack) -> str:
        working = [stacked_state for stacked_state in stack.stacked_states if isinstance(stacked_state.state, Working)]
        return working[-1].state_key.generation if working else "idle"
