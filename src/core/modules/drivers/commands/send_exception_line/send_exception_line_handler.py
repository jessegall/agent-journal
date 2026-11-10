from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.support.developer_nudges import EXCEPTION_LINE
from core.modules.drivers.support.nudger import Nudger

EXCEPTION_LINE_SOURCE = "developer.exception"


class SendExceptionLineHandler(Handler[SendExceptionLine, None]):
    """Gives the main agent the line about one exception."""

    command = SendExceptionLine
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendExceptionLine, context: Context) -> None:
        self.nudger.send(command.agent_id, EXCEPTION_LINE, EXCEPTION_LINE_SOURCE, context, exception=command.exception_id)
