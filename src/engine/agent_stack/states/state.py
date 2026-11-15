from typing import ClassVar

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.reason import Reason
from engine.agent_stack.stop_answer import StopAnswer
from engine.enums.stack_level import StackLevel
from engine.enums.work_stop import WorkStop


class State:
    """One of the seven states an agent's stack is built from, used as an instance with its data; a module
    never defines one."""

    lane: ClassVar[StackLevel]
    rank: ClassVar[int]

    def stop_answer(self, contract: WorkStop) -> StopAnswer:
        return StopAnswer.allowed()

    def refuses_stop(self, escalation: Escalation | None) -> bool:
        return False

    def stop_refusal(self) -> Reason:
        raise NotImplementedError(f"{type(self).__name__} refuses no stop")
