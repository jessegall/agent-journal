from journal.features.migration.project_kind import ProjectKind
from journal.features.migration.version_3_row import Version3Row
from journal.features.migration.version_3_rows import Version3Rows
from journal.models.actor import Actor
from journal.models.doc import Doc
from journal.repositories.docs import Docs
from journal.repositories.migrated_rows import MigratedRows


class BringDocs(ProjectKind):
    """A document keeps its title, its line and its current text; its older revisions stay in the backup."""

    kind = "doc"
    title = "documents"

    def __init__(self, ledger: MigratedRows, docs: Docs) -> None:
        super().__init__(ledger)
        self.docs = docs

    def rows(self, rows: Version3Rows) -> list[Version3Row]:
        return rows.docs()

    def made(self, row: Version3Row, by: Actor) -> Doc:
        return self.docs.imported(Doc(title=row.title, abstract=row.abstract, body=row.markdown()), row.made_at(), by)
