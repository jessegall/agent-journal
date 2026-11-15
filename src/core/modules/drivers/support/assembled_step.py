from dataclasses import dataclass

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.step_result import StepResult


@dataclass(frozen=True)
class AssembledStep:
    """The agent machine's step of a hook: the view it read and what it
    gives the save, which runs in the hook call's own write."""

    view: AgentView
    step: StepResult
