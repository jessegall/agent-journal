from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.plans.models.plan import Plan

MODELS = {"docs": (Doc, "document"), "reports": (Report, "report"), "plans": (Plan, "plan")}


class ShareTargets:
    """What a link opens, a document, a report or a plan, named as docs:12 and checked to exist."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def row(self, target: str) -> Model:
        table, _, row = target.strip().partition(":")
        if table not in MODELS or not row.isdigit():
            raise Refusal(f"only a document, a report or a plan can be shared, not {target!r}", "write it as docs:12, reports:4 or plans:2")
        model, noun = MODELS[table]
        rows = self.queries.query(model).filter(id=int(row))
        if not rows.exists():
            raise Refusal(f"{noun} {row} does not exist", f"list them with journal {model.cli_name} list")
        return rows.find(int(row))
