from engine.caller.process_chain import ProcessChain
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.models.agent import Agent


class RecordAgentProcessHandler(Handler[RecordAgentProcess, Agent]):
    """Saves an agent's process with the start the process table reads for it."""

    command = RecordAgentProcess

    def __init__(self, rows: EventRows, repository: Repository, chain: ProcessChain) -> None:
        self.rows, self.repository, self.chain = rows, repository, chain

    def handle(self, command: RecordAgentProcess, context: Context) -> Agent:
        return self.repository.update(self.rows.required(Agent, command.agent_id), context, pid=command.pid, ended_at=None, process_started_at=self.chain.start_timestamp(command.pid),
                                      launched_at=context.timestamp)
