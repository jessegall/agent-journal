from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.check_agent_programs.check_agent_programs import CheckAgentPrograms
from core.modules.agents.support.agent_dispatcher import AgentDispatcher


class CheckAgentProgramsHandler(Handler[CheckAgentPrograms, None]):
    """Runs one round of the dispatcher's corrections for the environment of the command."""

    command = CheckAgentPrograms
    disabled_scopes = [ActorScope]

    def __init__(self, dispatcher: AgentDispatcher) -> None:
        self.dispatcher = dispatcher

    def handle(self, command: CheckAgentPrograms, context: Context) -> None:
        self.dispatcher.reconcile(context)
