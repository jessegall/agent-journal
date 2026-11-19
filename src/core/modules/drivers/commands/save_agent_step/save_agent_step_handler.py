from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.drivers.commands.save_agent_step.save_agent_step import SaveAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest


class SaveAgentStepHandler(Handler[SaveAgentStep, None]):
    """Marks the request served and saves its step, so a step the step itself asks for opens a request of its own
    for the next round."""

    command = SaveAgentStep

    def __init__(self, rows: EventRows, repository: Repository, steps: StepWriter) -> None:
        self.rows, self.repository, self.steps = rows, repository, steps

    def handle(self, command: SaveAgentStep, context: Context) -> None:
        request = self.rows.required(AgentStepRequest, command.request_id)
        self.repository.save_change(request, request.changed(served_at=context.timestamp), context)
        if not self.steps.save(command.view, command.step, None, context).is_saved:
            raise StepConflictError()
