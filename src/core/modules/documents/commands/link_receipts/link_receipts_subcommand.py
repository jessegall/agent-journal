from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.support.link_pages import LinkPages
from core.modules.documents.support.message_receipt import MessageReceipt

MOST_MESSAGES = 50
NAMED_PAGE_SIZE = 10
SENT_PAGE_SIZE = 25


class LinkReceiptsSubcommand(ReadSubcommand[tuple[MessageReceipt, ...]]):
    """`journal link receipts --messages <ids>`: for each message, the first page of the rows it names and of the agents
    it also went to, read together so a chat reads the links of the messages it shows in one request."""

    cli_name = "link"
    name = "receipts"

    def __init__(self, pages: LinkPages) -> None:
        self.pages = pages

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--messages", required=True, help="message numbers separated by commas")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[MessageReceipt, ...]:
        numbers = tuple(dict.fromkeys(int(number) for number in arguments.messages.split(",") if number.strip()))
        if not numbers or len(numbers) > MOST_MESSAGES:
            raise Refusal(f"name between 1 and {MOST_MESSAGES} messages")
        return tuple(MessageReceipt(number, self.pages.read(self.asked(number, (LinkType.SUBJECT, LinkType.EDITED), NAMED_PAGE_SIZE, True)),
                                    self.pages.read(self.asked(number, (LinkType.RECIPIENT,), SENT_PAGE_SIZE, False))) for number in numbers)

    @staticmethod
    def asked(number: int, types: tuple[LinkType, ...], size: int, grouped: bool) -> Namespace:
        return Namespace(source=f"message:{number}", target=None, row=None, page=1, page_size=size, type=list(types), group_counterparts=grouped,
                         first_counterpart=None, outside_plan=False, target_model=None)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, tuple):
            return
        output.write("\n".join(f"message:{receipt.message_id}  {receipt.named.total} named  {receipt.sent.total} sent" for receipt in value),
                     {"messages": {str(receipt.message_id): {"named": self.pages.payload(receipt.named, output), "sent": self.pages.payload(receipt.sent, output)} for receipt in value}})
