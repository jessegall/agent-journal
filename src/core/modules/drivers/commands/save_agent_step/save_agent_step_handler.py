from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.drivers.commands.save_agent_step.save_agent_step import SaveAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.read_versions_rows import ReadVersionsRows


class SaveAgentStepHandler(Handler[SaveAgentStep, None]):
    """Marks the request served and saves its step, so a step the step itself asks for opens a request of its own
    for the next round. A step whose stack moved since its view was read is not saved: a newer step already decided
    with what the request asked for, so the request is served all the same; a basis moved any other way raises,
    and the request waits for the next round."""

    command = SaveAgentStep

    def __init__(self, rows: EventRows, repository: Repository, steps: StepWriter, stacks: ReadVersionsRows) -> None:
        self.rows, self.repository, self.steps, self.stacks = rows, repository, steps, stacks

    def handle(self, command: SaveAgentStep, context: Context) -> None:
        request = self.rows.required(AgentStepRequest, command.request_id)
        self.repository.save_change(request, request.changed(served_at=context.timestamp), context)
        if not self.steps.save(command.view, command.step, None, context).is_saved and not self.has_newer_step(command):
            raise StepConflictError()

    def has_newer_step(self, command: SaveAgentStep) -> bool:
        row = self.stacks.row(command.view.agent.agent_id)
        return (row.version if row is not None else 0) != command.view.read_versions.stack_version
