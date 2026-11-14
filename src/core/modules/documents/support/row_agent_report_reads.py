from engine.query.queries import Queries
from core.modules.agents.support.agent_report_reads import AgentReportReads
from core.modules.documents.models.report import Report


class RowAgentReportReads(AgentReportReads):
    """Reads the newest report an agent filed."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def newest_report_id(self, agent_id: int) -> int | None:
        report = self.queries.query(Report).filter(creator_id=agent_id).descending("id").first()
        return None if report is None else report.id
