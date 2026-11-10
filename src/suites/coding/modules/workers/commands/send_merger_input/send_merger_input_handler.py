from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.merger_nudges import MERGER_SOURCE
from suites.coding.modules.workers.commands.send_merger_input.send_merger_input import SendMergerInput


class SendMergerInputHandler(Handler[SendMergerInput, None]):
    """Puts a worker's report before the merger, or the main agent when the merger is off."""

    command = SendMergerInput

    def __init__(self, inbox: MergerInbox, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.inbox = inbox

    def handle(self, command: SendMergerInput, context: Context) -> None:
        self.inbox.send(f"worker:{self.numbers.number(AGENT_MODEL_NAME, command.worker_id)} reports: {command.text}", MERGER_SOURCE, context)
