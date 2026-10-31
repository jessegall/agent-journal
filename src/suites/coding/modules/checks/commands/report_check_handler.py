from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.report_check import ReportCheck
from suites.coding.modules.checks.models.check import Check


class ReportCheckHandler(Handler[ReportCheck, Check]):
    """Stamps the moment the agent was told a check fails, so it is told once and again only after a while."""

    command = ReportCheck

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ReportCheck, context: Context) -> Check:
        return self.repository.save(replace(self.queries.query(Check).find(command.check_id), reported_at=context.timestamp), context)
