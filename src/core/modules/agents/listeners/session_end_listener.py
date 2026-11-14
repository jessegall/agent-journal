from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_sessions import AgentSessions


class SessionEndListener(SaveListener[AgentEnded]):
    """Writes the end of an agent's current session in its history when the agent ends, in the same
    transaction. A session a replacement closed before keeps the reason the replacement gave."""

    name = "agents.session-end"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, sessions: AgentSessions) -> None:
        self.sessions = sessions

    def handle(self, event: AgentEnded, context: Context) -> None:
        self.sessions.ended(event.row.id, EndReason.FINISHED, context)
