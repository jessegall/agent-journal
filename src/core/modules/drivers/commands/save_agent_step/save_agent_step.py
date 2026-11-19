from dataclasses import dataclass

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.step_result import StepResult
from engine.command.command import Command


@dataclass(frozen=True)
class SaveAgentStep(Command[None]):
    """Marks one step request served and saves the step worked out for it before this write, in one short write; a
    step whose stack moved since its view was read is left unsaved, as a newer step has decided already."""

    lock = True

    request_id: int
    view: AgentView
    step: StepResult
