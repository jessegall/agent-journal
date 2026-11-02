
from core.base.actor import Actor
from core.base.command.bus import Bus
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
from core.base.tasks.clear_delegated_tasks import ClearDelegatedTasks


class StopAgentHandler(Handler[StopAgent, Agent]):
    """Takes the agent's delegated tasks away from it, so nothing starts it again, then stops the program under
    the pid the agent's row keeps, only while that pid still runs that program, before the transaction opens
    since the stopped program's own hooks need the journal; then ends the session unless those hooks did."""

    command = StopAgent

    def __init__(self, queries: Queries, providers: Providers, repository: Repository, bus: Bus) -> None:
        self.queries, self.providers, self.repository, self.bus = queries, providers, repository, bus

    def prepare(self, command: StopAgent, actor: Actor) -> None:
        PersonCheck.require_actor(actor, "only a person stops an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already")
        if agent.pid is None:
            raise Refusal(f"the journal does not know the process of agent {agent.id}", "stop it in its own terminal")
        self.bus.run(ClearDelegatedTasks(agent.id), actor, environment_id=agent.environment_id)
        LeftoverProcess.stop(agent.pid, self.providers.provider(agent.program).executable)

    def handle(self, command: StopAgent, context: Context) -> Agent:
        PersonCheck.require(context, "only a person stops an agent")
        agent = self.queries.query(Agent).find(command.agent_id)
        return agent if agent.ended_at is not None else self.repository.save(agent.ended(context.timestamp), context)
