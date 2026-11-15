from dataclasses import dataclass

from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_stack.stack import Stack
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.record.wake_change import WakeChange


@dataclass(frozen=True)
class StepResult:
    """What one step of an agent gives its save: the basis it read, the stack after, its decision record and its wake change."""

    basis: AnswerBasis
    stack: Stack
    record: DecisionRecord
    wake: WakeChange
