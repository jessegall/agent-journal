from engine.check.step_condition import StepCondition
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.messages.models.message import Message


class ReportCommented(StepCondition):
    """Someone other than its author commented on the report, saying what came of it."""

    name = "documents.report-commented"

    def __init__(self, rows: EventRows, queries: Queries) -> None:
        self.rows, self.queries = rows, queries

    def problem(self, subject_id: int) -> str | None:
        report = self.rows.required(Report, subject_id)
        comments = self.queries.query(Link).filter(source_model=Message.model_name, target_model=Report.model_name, target_id=subject_id)
        if comments.where("creator_id", "!=", report.creator_id).exists():
            return None
        return f"report {subject_id} has no comment on what came of it"
