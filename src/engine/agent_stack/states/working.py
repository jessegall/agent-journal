from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.reason import Reason
from engine.agent_stack.states.state import State
from engine.agent_stack.stop_answer import StopAnswer
from engine.agent_stack.work_reference import WorkReference
from engine.enums.stack_level import StackLevel
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class Working(State):
    """Work in hand, as its module described it: what it is, the text that names it and whether any remains."""

    level: ClassVar[StackLevel] = StackLevel.WORK
    rank: ClassVar[int] = 10
    work: WorkReference
    work_remains: bool
    stop_reason: Reason

    def stop_answer(self, contract: WorkStop) -> StopAnswer:
        is_job_contract = self.work.is_job() and contract is not WorkStop.REFUSE_DURING_WORK
        if self.work_remains and not (is_job_contract and contract is WorkStop.JOB_REPORT):
            return StopAnswer.refusal(self.stop_reason)
        if is_job_contract:
            return StopAnswer.job_report(self.work)
        return StopAnswer.allowed()
