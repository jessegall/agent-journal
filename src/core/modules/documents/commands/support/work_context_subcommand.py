from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task
from core.modules.documents.commands.support.work_context_arguments import WorkContextArguments


class WorkContextSubcommand(WorkContextArguments, ReadSubcommand[WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Reads a resource's conversation without selecting any message as the active request."""

    model: type[Task | Plan]

    def __init__(self, queries: Queries, reader: WorkContextReader) -> None:
        self.queries, self.reader = queries, reader

    def read(self, arguments: Namespace, caller: Caller) -> WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        request = self.request(arguments)
        row = self.queries.query(self.model).find(arguments.row_id)
        return self.reader.read(row, caller, request)
