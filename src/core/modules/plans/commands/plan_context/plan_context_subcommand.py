from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.plan_context.read_plan_context import ReadPlanContext
from core.modules.documents.commands.support.work_context_subcommand import WorkContextArguments
from core.modules.documents.support.work_context_page import WorkContextPage, WorkContextText, WorkContextAttachmentPage, WorkContextFile


class PlanContextSubcommand(WorkContextArguments, Subcommand[ReadPlanContext, WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Reads plan context and acknowledges its current execution start for the receiving agent."""

    cli_name = "plan"

    def command(self, arguments: Namespace, caller: Caller) -> ReadPlanContext:
        return ReadPlanContext(arguments.row_id, self.request(arguments))
