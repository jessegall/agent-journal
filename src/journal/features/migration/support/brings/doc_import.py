from journal.features.migration.support.project_kind import ProjectKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.models.doc import Doc
from journal.repositories.docs import Docs
from journal.repositories.migrated_rows import MigratedRows


class DocImport(ProjectKind):
    """A document keeps its title, its line and its current text; its older revisions stay in the backup."""

    kind = "doc"
    title = "documents"

    def __init__(self, tally: MigratedRows, docs: Docs) -> None:
        super().__init__(tally)
        self.docs = docs

    def rows(self, rows: Version3Rows) -> list[Version3Row]:
        return rows.docs()

    def created(self, row: Version3Row, actor: Actor) -> Doc:
        return self.docs.imported(Doc(title=row.title, abstract=row.abstract, body=row.markdown()), row.creation_moment(), actor)
