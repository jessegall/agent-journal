from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_program import AgentProgram


class EndedAgentProgramListener(CommitListener[AgentEnded]):
    """Stops the program of an agent that another ended, after the commit, so no hook waits on a process. An agent
    that ended itself stops by itself, a row reopened since runs a new program, and StopAgent stopped its own."""

    name = "agents.ended-agent-program"
    disabled_scopes = [ActorScope]

    def __init__(self, program: AgentProgram) -> None:
        self.program = program

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if self.needs_stop(event.row, logged):
            self.program.stop(event.row)

    @staticmethod
    def needs_stop(agent: Agent, logged: LoggedEvent) -> bool:
        return logged.actor_id != agent.id and agent.ended_at is not None and logged.command != StopAgent.label()
