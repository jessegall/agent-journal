from journal.features.migration.project_kind import ProjectKind
from journal.features.migration.version_3_row import Version3Row
from journal.models.actor import Actor
from journal.models.rule import Rule
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.rules import Rules


class BringRules(ProjectKind):
    """A rule of the project keeps its text and keywords; a struck one stays behind."""

    kind = "rule"
    title = "rules"

    def __init__(self, ledger: MigratedRows, rules: Rules) -> None:
        super().__init__(ledger)
        self.rules = rules

    def left_behind(self, row: Version3Row) -> str:
        return super().left_behind(row) or ("struck" if row.completed else "")

    def made(self, row: Version3Row, by: Actor) -> Rule:
        return self.rules.imported(Rule(text=row.brief or row.title, keywords=tuple(row.listed("keywords"))), row.made_at(), by)
