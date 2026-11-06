from core.base.caller.process_chain import ProcessChain
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class RecordAgentProcessHandler(Handler[RecordAgentProcess, Agent]):
    """Saves an agent's process with the start the process table reads for it."""

    command = RecordAgentProcess

    def __init__(self, agents: AgentRows, repository: Repository, chain: ProcessChain) -> None:
        self.agents, self.repository, self.chain = agents, repository, chain

    def handle(self, command: RecordAgentProcess, context: Context) -> Agent:
        return self.repository.update(self.agents.find(command.agent_id), context, pid=command.pid, process_started_at=self.chain.started_at(command.pid))
