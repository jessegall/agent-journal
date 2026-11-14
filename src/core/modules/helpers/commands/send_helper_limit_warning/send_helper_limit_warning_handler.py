from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.receivers import Receivers
from engine.driver.nudger import Nudger
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning import SendHelperLimitWarning
from core.modules.helpers.support.helper_nudges import HELPER_LIMIT_WARNING


class SendHelperLimitWarningHandler(Handler[SendHelperLimitWarning, None]):
    """Gives the parent the line that its helper is near a limit."""

    command = SendHelperLimitWarning

    def __init__(self, nudger: Nudger, receivers: Receivers, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.nudger, self.receivers = nudger, receivers

    def handle(self, command: SendHelperLimitWarning, context: Context) -> None:
        receiver = self.receivers.receiver(command.parent_id)
        self.nudger.send(receiver.id, HELPER_LIMIT_WARNING, SendHelperLimitWarning.source(command.job_id), context, agent=self.numbers.number(AGENT_MODEL_NAME, command.helper_id), limit=command.limit_name)
