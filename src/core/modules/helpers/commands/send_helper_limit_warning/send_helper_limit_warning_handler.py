from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.support.receivers import Receivers
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning import SendHelperLimitWarning
from core.modules.helpers.support.helper_nudges import HELPER_LIMIT_WARNING


class SendHelperLimitWarningHandler(Handler[SendHelperLimitWarning, None]):
    """Gives the parent the line that its helper is near a limit."""

    command = SendHelperLimitWarning

    def __init__(self, nudger: Nudger, receivers: Receivers) -> None:
        self.nudger, self.receivers = nudger, receivers

    def handle(self, command: SendHelperLimitWarning, context: Context) -> None:
        receiver = self.receivers.receiver(command.parent_id)
        self.nudger.send(receiver.id, HELPER_LIMIT_WARNING, SendHelperLimitWarning.source(command.job_id), context, agent=command.helper_id, limit=command.limit_name)
