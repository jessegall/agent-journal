from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.documents.commands.plan_context.read_plan_context import ReadPlanContext
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_context_delivery import PlanContextDelivery


class ReadPlanContextHandler(Handler[ReadPlanContext, WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile]):
    """Acknowledges a plan start only after its shared context read succeeds."""

    command = ReadPlanContext

    def __init__(self, queries: Queries, reader: WorkContextReader, delivery: PlanContextDelivery) -> None:
        self.queries, self.reader, self.delivery = queries, reader, delivery

    def handle(self, command: ReadPlanContext, context: Context) -> WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        plan = self.queries.query(Plan).find(command.plan_id)
        page = self.reader.read(plan, Caller(context.actor, context.environment_id), command.request)
        if context.actor.is_agent():
            self.delivery.acknowledge(plan, context)
        return page
