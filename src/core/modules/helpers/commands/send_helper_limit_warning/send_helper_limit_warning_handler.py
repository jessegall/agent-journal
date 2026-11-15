from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.receivers import Receivers
from engine.driver.message_sender import MessageSender
from core.modules.helpers.commands.send_helper_limit_warning.send_helper_limit_warning import SendHelperLimitWarning
from core.modules.helpers.agent_messages.helper_limit_warning_message import HelperLimitWarningMessage


class SendHelperLimitWarningHandler(Handler[SendHelperLimitWarning, None]):
    """Gives the parent the line that its helper is near a limit."""

    command = SendHelperLimitWarning

    def __init__(self, message_sender: MessageSender, receivers: Receivers, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.message_sender, self.receivers = message_sender, receivers

    def handle(self, command: SendHelperLimitWarning, context: Context) -> None:
        receiver = self.receivers.receiver(command.parent_id)
        self.message_sender.send(receiver.id, HelperLimitWarningMessage.declared(), SendHelperLimitWarning.source(command.job_id), context, agent=self.numbers.number(AGENT_MODEL_NAME, command.helper_id), limit=command.limit_name)
