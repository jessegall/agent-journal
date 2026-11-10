from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.documents.commands.plan_context.read_plan_context import ReadPlanContext
from core.modules.documents.commands.support.work_context_arguments import WorkContextArguments
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile


class ReadPlanContextSubcommand(WorkContextArguments, Subcommand[ReadPlanContext, WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Reads plan context and acknowledges its current execution start for the receiving agent."""

    cli_name = "plan"

    def command(self, arguments: Namespace, caller: Caller) -> ReadPlanContext:
        return ReadPlanContext(arguments.row_id, self.request(arguments))
