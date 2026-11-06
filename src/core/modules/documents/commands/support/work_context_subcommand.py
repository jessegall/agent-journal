from argparse import ArgumentParser, Namespace
from dataclasses import asdict

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.support.work_context_page import WorkContextPage, WorkContextRequest, WorkContextText, WorkContextAttachmentPage, WorkContextFile
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.documents.support.work_context_order import WorkContextOrder
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task


class WorkContextSubcommand(ReadSubcommand[WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Reads a resource's conversation without selecting any message as the active request."""

    model: type[Task | Plan]
    name = "context"
    help = "Read bounded conversation pages; continue with --message/--text-offset or --ancestor-cursor without selecting a request."

    def __init__(self, queries: Queries, reader: WorkContextReader) -> None:
        self.queries, self.reader = queries, reader

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

    def read(self, arguments: Namespace, caller: Caller) -> WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        if not 0 < arguments.row_id <= 9223372036854775807:
            raise Refusal("name a positive context resource number")
        row = self.queries.query(self.model).find(arguments.row_id)
        return self.reader.read(row, caller, WorkContextRequest(arguments.page, arguments.page_size, arguments.message,
                                                               arguments.text_offset, arguments.ancestor_cursor,
                                                               arguments.attachment, arguments.attachment_page,
                                                               WorkContextOrder.NEWEST if arguments.newest else WorkContextOrder.OLDEST))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, (WorkContextPage, WorkContextText, WorkContextAttachmentPage, WorkContextFile)):
            output.write("\n".join(value.lines()), asdict(value))
