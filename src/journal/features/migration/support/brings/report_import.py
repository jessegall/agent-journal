from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.report import Report
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.reports import Reports


class ReportImport(EnvironmentKind):
    """A report keeps its title, its line and its text with its sections."""

    kind = "report"
    title = "reports"

    def __init__(self, environments: Environments, tally: MigratedRows, reports: Reports) -> None:
        super().__init__(environments, tally)
        self.reports = reports

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Report:
        return self.reports.imported(Report(environment_id=target.id, title=row.title, abstract=row.abstract, body=row.markdown()), row.created_at(), actor)
