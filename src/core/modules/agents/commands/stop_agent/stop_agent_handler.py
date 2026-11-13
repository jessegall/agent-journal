
from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.agents.support.agent_label import AgentLabel




class StopAgentHandler(Handler[StopAgent, Agent]):
    """Stops an agent's program, releases its tasks, writes who stopped it as the reason its session ended and
    has the dispatcher end its row."""

    command = StopAgent

    def __init__(self, queries: Queries, program: AgentProgram, dispatcher: AgentDispatcher, sessions: AgentSessions) -> None:
        self.queries, self.program, self.dispatcher, self.sessions = queries, program, dispatcher, sessions

    def prepare(self, command: StopAgent, actor: Actor) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"{AgentLabel.labelled(agent).text} has ended already")
        if agent.pid is None and not self.program.stop(agent) and not agent.is_main:
            raise Refusal(f"the journal does not know the process of {AgentLabel.labelled(agent).text}", "stop it in its own terminal")
        if agent.pid is not None:
            self.program.stop(agent)

    def handle(self, command: StopAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            return agent
        self.sessions.ended(agent.id, StopReason.AGENT if context.actor.is_agent() else StopReason.PERSON, context)
        return self.dispatcher.end_row(agent, context)
