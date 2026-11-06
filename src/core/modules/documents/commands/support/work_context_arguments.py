from argparse import ArgumentParser, Namespace
from dataclasses import asdict

from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_request import WorkContextRequest
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile
from core.modules.documents.support.work_context_order import WorkContextOrder


class WorkContextArguments:
    """Parses and renders the shared task and plan context commands."""

    name = "context"
    help = "Read bounded conversation pages; continue with --message/--text-offset or --ancestor-cursor without selecting a request."

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--page-size", type=int, default=5)
        parser.add_argument("--message", type=int)
        parser.add_argument("--text-offset", type=int, default=0)
        parser.add_argument("--ancestor-cursor")
        parser.add_argument("--newest", action="store_true")
        attachments = parser.add_mutually_exclusive_group()
        attachments.add_argument("--attachment")
        attachments.add_argument("--attachment-page", type=int)

    def request(self, arguments: Namespace) -> WorkContextRequest:
        if not 0 < arguments.row_id <= 9223372036854775807:
            raise Refusal("name a positive context resource number")
        return WorkContextRequest(arguments.page, arguments.page_size, arguments.message,
                                  arguments.text_offset, arguments.ancestor_cursor,
                                  arguments.attachment, arguments.attachment_page,
                                  WorkContextOrder.NEWEST if arguments.newest else WorkContextOrder.OLDEST)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, (WorkContextPage, WorkContextText, WorkContextAttachmentPage, WorkContextFile)):
            output.write("\n".join(value.lines()), asdict(value))
