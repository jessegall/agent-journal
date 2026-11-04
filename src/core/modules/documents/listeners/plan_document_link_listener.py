from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.plans.models.plan import Plan


class PlanDocumentLinkListener(SaveListener):
    """A plan that takes a document is linked to it in the same transaction, once; a document that does not
    exist is refused."""

    name = "documents.plan-document-link"
    event = "plan.create|plan.update"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        plan = change.row
        if not isinstance(plan, Plan) or plan.document_id is None:
            return
        if change.old_row is not None and "document_id" not in change.fields:
            return
        if not self.queries.query(Doc).filter(id=plan.document_id).exists():
            raise Refusal(f"no doc {plan.document_id}", "journal doc list lists them")
        links = self.queries.query(Link).filter(source_model=Doc.model_name, source_id=plan.document_id, target_model=Plan.model_name, target_id=plan.id)
        if not links.exists():
            self.repository.save(Link(creator_id=change.actor.id, source_model=Doc.model_name, source_id=plan.document_id, target_model=Plan.model_name, target_id=plan.id,
                                      link_type=LinkType.SUBJECT), change.context)
