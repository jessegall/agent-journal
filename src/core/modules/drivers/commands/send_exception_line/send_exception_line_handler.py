from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.nudges.exception_line_nudge import ExceptionLineNudge
from engine.driver.nudger import Nudger

EXCEPTION_LINE_SOURCE = "developer.exception"


class SendExceptionLineHandler(Handler[SendExceptionLine, None]):
    """Gives the main agent the line about one exception."""

    command = SendExceptionLine
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendExceptionLine, context: Context) -> None:
        self.nudger.send(command.agent_id, ExceptionLineNudge.declared(), EXCEPTION_LINE_SOURCE, context, exception=command.exception_id)
