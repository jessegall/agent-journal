from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.machine_assembly import MachineAssembly


class RunAgentStepHandler(Handler[RunAgentStep, None]):
    """Marks the request served, then steps the request's agent and saves the step in this write, so a step
    the step itself asks for opens a request of its own for the next round. A step outside a hook asks
    nothing, so it runs no admission effect."""

    command = RunAgentStep

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, reader: AgentViewReader, assembly: MachineAssembly, steps: StepWriter) -> None:
        self.queries, self.repository, self.agents = queries, repository, agents
        self.reader, self.assembly, self.steps = reader, assembly, steps

    def handle(self, command: RunAgentStep, context: Context) -> None:
        request = self.queries.query(AgentStepRequest).find(command.request_id)
        self.repository.save_change(request, request.changed(served_at=context.timestamp), context)
        agent = self.agents.find(request.session_agent_id)
        question = Question.none()
        view = self.assembly.with_states(self.reader.read(agent.id, question), question)
        step = self.assembly.machine(agent.role).step(view, question)
        if not self.steps.save(view, step, None, context).is_saved:
            raise StepConflictError()
