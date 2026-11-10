from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.pause_agent.pause_agent import PauseAgent
from core.modules.drivers.listeners.typed_line_listener import PAUSE_SOURCE
from core.modules.drivers.support.driver_nudges import PAUSED_REFUSAL
from engine.driver.nudger import Nudger
from core.modules.agents.support.agent_label import AgentLabel


class PauseAgentHandler(Handler[PauseAgent, Agent]):
    """Marks a running agent paused and leaves the line that says so, which a listener types once this is
    committed; an agent that ended or is paused already is refused."""

    command = PauseAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: PauseAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} has ended")
        if agent.paused_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} is paused already")
        paused = self.repository.update(agent, context, paused_at=context.timestamp)
        self.nudger.send(agent.id, PAUSED_REFUSAL, PAUSE_SOURCE, context)
        return paused
