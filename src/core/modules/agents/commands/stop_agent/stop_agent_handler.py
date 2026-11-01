from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.leftover_process import LeftoverProcess
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.person_check import PersonCheck


class StopAgentHandler(Handler[StopAgent, Agent]):
    """Stops the program under the pid the agent's row keeps, only while that pid still runs that program, and ends the session."""

    command = StopAgent

    def __init__(self, queries: Queries, providers: Providers, repository: Repository) -> None:
        self.queries, self.providers, self.repository = queries, providers, repository

    def handle(self, command: StopAgent, context: Context) -> Agent:
        PersonCheck.require(context, "only a person stops an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already")
        if agent.pid is None:
            raise Refusal(f"the journal does not know the process of agent {agent.id}", "stop it in its own terminal")
        LeftoverProcess.stop(agent.pid, self.providers.provider(agent.program).executable)
        return self.repository.save(replace(agent, ended_at=context.timestamp), context)
