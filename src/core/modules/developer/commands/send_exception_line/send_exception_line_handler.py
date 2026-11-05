from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.scope.actor_scope import ActorScope
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.drivers.support.nudger import Nudger

EXCEPTION_LINE_SOURCE = "developer.exception"
EXCEPTION_LINE = NudgeDeclaration("developer.exception", NudgeType.STEERING, "the journal failed in {source}: {message}", turn_limited=False, wakes_agent=True)


class SendExceptionLineHandler(Handler[SendExceptionLine, None]):
    """Gives the main agent the line about one exception."""

    command = SendExceptionLine
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendExceptionLine, context: Context) -> None:
        self.nudger.send(command.agent_id, EXCEPTION_LINE, EXCEPTION_LINE_SOURCE, context, source=command.source, message=command.message)
