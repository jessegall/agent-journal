
from engine.actor.actor import Actor
from engine.enums.agent_role import AgentRole
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program import AgentProgram
from engine.tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.agents.support.current_agent_policy import CurrentAgentPolicy




class StopAgentHandler(Handler[StopAgent, Agent]):
    """Stops an agent's program, releases its tasks and ends its session."""

    command = StopAgent

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, program: AgentProgram, suites: CurrentAgentPolicy) -> None:
        self.queries, self.repository, self.bus, self.program = queries, repository, bus, program
        self.suites = suites

    def prepare(self, command: StopAgent, actor: Actor) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended already")
        if agent.pid is None and not self.program.stop(agent) and agent.role != AgentRole.MAIN:
            raise Refusal(f"the journal does not know the process of agent {agent.id}", "stop it in its own terminal")
        self.bus.run(ClearDelegatedTasks(agent.id), actor, environment_id=agent.environment_id)
        if agent.pid is not None:
            self.program.stop(agent)

    def handle(self, command: StopAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        return agent if agent.ended_at is not None else self.repository.save(agent.ended(context.timestamp, self.suites.agent_policy()), context)
