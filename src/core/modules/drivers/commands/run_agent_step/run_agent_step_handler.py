from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from core.modules.drivers.commands.save_agent_step.save_agent_step import SaveAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.support.effect_commands import EffectCommands
from core.modules.drivers.support.machine_assembly import MachineAssembly


class RunAgentStepHandler(Handler[RunAgentStep, None]):
    """Steps the request's agent outside any write: reads its view, works out the step and the commands of its
    effects, which the save reads back, and then saves the step in one short write of its own. A step outside a
    hook asks nothing, so it runs no admission effect."""

    command = RunAgentStep

    def __init__(self, rows: EventRows, agents: AgentRows, reader: AgentViewReader, assembly: MachineAssembly, effect_commands: EffectCommands, bus: Bus) -> None:
        self.rows, self.agents, self.reader, self.assembly = rows, agents, reader, assembly
        self.effect_commands, self.bus = effect_commands, bus

    def handle(self, command: RunAgentStep, context: Context) -> None:
        request = self.rows.required(AgentStepRequest, command.request_id)
        agent = self.agents.find(request.session_agent_id)
        question = Question.none()
        view = self.assembly.with_states(self.reader.read(agent.id, question), question)
        step = self.assembly.machine(agent.role).step(view, question)
        for effect in step.record.effects():
            self.effect_commands.commands(effect, view, step.record)
        self.bus.run_with_context(SaveAgentStep(command.request_id, view, step), context)
