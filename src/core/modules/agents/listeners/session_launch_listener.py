from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.events.agent_launched import AgentLaunched
from core.modules.agents.support.agent_sessions import AgentSessions


class SessionLaunchListener(SaveListener[AgentLaunched]):
    """Gives an agent's current session its start in the history when the launcher starts its program, in the
    same transaction. A session that already has a start keeps it."""

    name = "agents.session-launch"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, sessions: AgentSessions) -> None:
        self.sessions = sessions

    def handle(self, event: AgentLaunched, context: Context) -> None:
        self.sessions.launched(event.row.id, context)
