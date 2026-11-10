from core.base.change.created import Created
from core.base.change.updated import Updated
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.plans.models.plan import Plan


class PlanDocumentLinkListener(SaveListener[Created[Plan] | Updated[Plan]]):
    """A plan that takes a document is linked to it in the same transaction, once; a document that does not
    exist is refused."""

    name = "documents.plan-document-link"

    def __init__(self, queries: Queries, links: RowLinkWriter) -> None:
        self.queries, self.links = queries, links

    def handle(self, event: Created[Plan] | Updated[Plan], context: Context) -> None:
        plan = event.row
        if plan.document_id is None:
            return
        if event.old_row is not None and event.old_row.document_id == plan.document_id:
            return
        if not self.queries.query(Doc).filter(id=plan.document_id).exists():
            raise Refusal(f"no doc {plan.document_id}", "journal doc list lists them")
        self.links.save(Link(creator_id=context.actor.id, source_model=Doc.model_name, source_id=plan.document_id, target_model=Plan.model_name, target_id=plan.id,
                             link_type=LinkType.SUBJECT), context)
