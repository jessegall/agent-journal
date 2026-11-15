from abc import ABC, abstractmethod

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.step_result import StepResult
from engine.agent_step.step_commit import StepCommit
from engine.command.context import Context


class StepWriter(ABC):
    """Saves a step inside the write it is given (doc 1310 section 6.1), or reports a conflict when the answer basis
    changed since it was read; a required admission effect that fails raises and rolls the whole write back."""

    @abstractmethod
    def save(self, view: AgentView, step: StepResult, hook_call_id: int | None, context: Context) -> StepCommit: ...
