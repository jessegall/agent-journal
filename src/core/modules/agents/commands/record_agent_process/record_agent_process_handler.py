from engine.caller.process_chain import ProcessChain
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.program_process import ProgramProcess


class RecordAgentProcessHandler(Handler[RecordAgentProcess, Agent]):
    """Has the dispatcher write the process the launcher started an agent's program in, with the start the
    process table reads for it."""

    command = RecordAgentProcess

    def __init__(self, rows: EventRows, dispatcher: AgentDispatcher, chain: ProcessChain) -> None:
        self.rows, self.dispatcher, self.chain = rows, dispatcher, chain

    def handle(self, command: RecordAgentProcess, context: Context) -> Agent:
        process = ProgramProcess(command.pid, self.chain.start_timestamp(command.pid))
        return self.dispatcher.record_launch(self.rows.required(Agent, command.agent_id), process, context)
