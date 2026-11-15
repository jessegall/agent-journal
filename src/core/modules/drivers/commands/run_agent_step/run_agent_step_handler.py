from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.rule_answers import RuleAnswers
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.answering_slices import AnsweringSlices
from core.modules.drivers.support.machine_assembly import MachineAssembly
from core.modules.drivers.support.walk_answer_policy import WalkAnswerPolicy

# outside a hook no old rule answered, so the step weighs no refusal of the walk
EMPTY_WALK = RuleAnswers((), ())


class RunAgentStepHandler(Handler[RunAgentStep, None]):
    """Steps the request's agent with the slices that answer it, saves the step in this write and marks the
    request served; an agent no slice answers is served with no step, since the old paths still act for it.
    A step outside a hook asks nothing, so it runs no admission effect."""

    command = RunAgentStep

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, slices: AnsweringSlices, reader: AgentViewReader, assembly: MachineAssembly,
                 steps: StepWriter) -> None:
        self.queries, self.repository, self.agents, self.slices = queries, repository, agents, slices
        self.reader, self.assembly, self.steps = reader, assembly, steps

    def handle(self, command: RunAgentStep, context: Context) -> None:
        request = self.queries.query(AgentStepRequest).find(command.request_id)
        agent = self.agents.find(request.session_agent_id)
        agent_slices = self.slices.tick_slices(agent)
        if agent_slices:
            question = Question.none()
            view = self.assembly.with_sliced_needs(self.reader.read(agent.id, question), question, agent_slices)
            step = self.assembly.sliced_machine(agent.role, agent_slices, WalkAnswerPolicy(EMPTY_WALK)).step(view, question)
            if not self.steps.save(view, step, None, context).is_saved:
                raise StepConflictError()
        self.repository.save_change(request, request.changed(served_at=context.timestamp), context)
