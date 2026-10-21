from journal.features.migration.support.project_kind import ProjectKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.rule import Rule
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.rules import Rules


class RuleImport(ProjectKind):
    """A rule of the project keeps its text and keywords; a struck one stays behind."""

    kind = "rule"
    title = "rules"

    def __init__(self, ledger: MigratedRows, rules: Rules) -> None:
        super().__init__(ledger)
        self.rules = rules

    def skipped(self, row: Version3Row) -> str:
        return super().skipped(row) or ("struck" if row.completed else "")

    def created(self, row: Version3Row, actor: Actor) -> Rule:
        return self.rules.imported(Rule(text=row.brief or row.title, keywords=tuple(row.listed("keywords"))), row.creation_time(), actor)
