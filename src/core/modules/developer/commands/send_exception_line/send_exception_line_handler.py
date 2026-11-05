from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger

EXCEPTION_LINE_SOURCE = "developer.exception"
EXCEPTION_LINE = NudgeDeclaration("developer.exception", NudgeType.STEERING, "the journal failed in {source}: {message}", turn_limited=False, wakes_agent=True)


class SendExceptionLineHandler(Handler[SendExceptionLine, None]):
    """Gives the main agent one line for each exception text, however often it comes back."""

    command = SendExceptionLine
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger, queries: Queries) -> None:
        self.nudger, self.queries = nudger, queries

    def handle(self, command: SendExceptionLine, context: Context) -> None:
        text = EXCEPTION_LINE.nudge(source=command.source, message=command.message).text
        if not self.queries.query(AgentLine).filter(session_agent_id=command.agent_id, source=EXCEPTION_LINE_SOURCE, text=text).exists():
            self.nudger.send(command.agent_id, EXCEPTION_LINE, EXCEPTION_LINE_SOURCE, context, source=command.source, message=command.message)
