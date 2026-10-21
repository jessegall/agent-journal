from journal.features.migration.support.project_kind import ProjectKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.repositories.migrated_rows import MigratedRows
from journal.models.check import Check
from journal.repositories.checks import Checks


class CheckImport(ProjectKind):
    """A check keeps its command, what it checks and how often it runs."""

    kind = "check"
    title = "checks"

    def __init__(self, ledger: MigratedRows, checks: Checks) -> None:
        super().__init__(ledger)
        self.checks = checks

    def created(self, row: Version3Row, actor: Actor) -> Check:
        return self.checks.imported(Check(title=row.title, brief=row.brief, command=row.data.get("command", ""), every=int(row.data.get("every", 0))), row.creation_time(), actor)
