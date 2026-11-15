from collections.abc import Sequence

from engine.agent_stack.stack import Stack
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_stack.states.working import Working
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.wake_cause import WakeCause
from engine.agent_machine.record.wake_change import WakeChange
from engine.enums.lane import Lane
from engine.enums.stop_answer_type import StopAnswerType
from engine.enums.wake_move import WakeMove
from engine.enums.work_stop import WorkStop

STOP_CAUSE = "drivers.stop-refused"
JOB_CAUSE = "drivers.job-open"


class WakeJudgement:
    """Whether a step writes the agent's wake obligation (doc 1310 section 6.4): a resting agent that needs
    attention, because a stop asked now would be refused, its own job is on top of a hand-in driver's work
    lane, or a declared wake cause is due; inhibited while it is Paused or Compacting."""

    def __init__(self, causes: Sequence[WakeCause]) -> None:
        self.causes = causes

    def change(self, view: AgentView, stack: Stack) -> WakeChange:
        causes = self.attention(view, stack) if view.is_resting else []
        if not causes:
            return WakeChange.unchanged()
        move = WakeMove.INHIBITED if stack.has(Paused) or stack.has(Compacting) else WakeMove.WRITTEN
        return WakeChange(move, self.work_generation(stack), tuple(causes))

    def attention(self, view: AgentView, stack: Stack) -> list[str]:
        work = Stack([frame for frame in stack.frames if frame.state.lane is not Lane.SAFETY])
        causes = [STOP_CAUSE] if work.stop_answer(view.work_stop, view.escalation).answer_type is StopAnswerType.REFUSED else []
        if self.has_open_job(view, stack):
            causes.append(JOB_CAUSE)
        return [*causes, *(cause.key for cause in self.causes if cause.needs_wake(view) and not cause.is_inhibited(view))]

    @staticmethod
    def has_open_job(view: AgentView, stack: Stack) -> bool:
        top = stack.work_lane_top().state
        return view.work_stop is WorkStop.HANDOVER and isinstance(top, Working) and top.work.is_job()

    @staticmethod
    def work_generation(stack: Stack) -> str:
        working = [frame for frame in stack.frames if isinstance(frame.state, Working)]
        return working[-1].need_key.generation if working else "idle"
