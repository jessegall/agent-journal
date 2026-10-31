from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.plans.models.plan import Plan

TABLES = ("docs", "reports", "plans")
MISSING_TABLES = {"docs": "the journal has no documents to share", "reports": "the journal has no reports to share"}


class ShareTargets:
    """What a link opens, a document, a report or a plan, named as docs:12 and checked to exist; only plans
    exist in the journal for now."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def plan(self, target: str) -> Plan:
        table, _, row = target.strip().partition(":")
        if table not in TABLES or not row.isdigit():
            raise Refusal(f"only a document, a report or a plan can be shared, not {target!r}", "write it as docs:12, reports:4 or plans:2")
        if table in MISSING_TABLES:
            raise Refusal(MISSING_TABLES[table], "share a plan")
        plans = self.queries.query(Plan).filter(id=int(row))
        if not plans.exists():
            raise Refusal(f"plan {row} does not exist", "list plans with journal plan list")
        return plans.find(int(row))
