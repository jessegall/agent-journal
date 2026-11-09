from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.plans.models.plan import Plan
from core.modules.sharing.models.share_link import ShareLink

MODELS: dict[str, tuple[type[Doc] | type[Report] | type[Plan], str]] = {"docs": (Doc, "document"), "reports": (Report, "report"), "plans": (Plan, "plan")}


class ShareTargets:
    """What a link opens, a document, a report or a plan, named as docs:12 and checked to exist."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def row(self, target: str) -> Doc | Report | Plan:
        table, _, row = target.strip().partition(":")
        if table not in MODELS or not row.isdigit():
            raise Refusal(f"only a document, a report or a plan can be shared, not {target!r}", "write it as docs:12, reports:4 or plans:2")
        model, target_type = MODELS[table]
        match = self.queries.query(model).filter(id=int(row)).first()
        if match is None:
            raise Refusal(f"{target_type} {row} does not exist", f"list them with journal {model.cli_name} list")
        return match

    def shared_row(self, link: ShareLink) -> Doc | Report | Plan:
        for table, (model, _) in MODELS.items():
            if model.model_name != link.row_model:
                continue
            return self.row(f"{table}:{link.row_id}")
        raise Refusal(f"share {link.id} refers to an unknown kind of document")
