from journal.features.migration.shipped_kind import ShippedKind
from journal.features.migration.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.template import Template
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.templates import Templates


class BringTemplates(ShippedKind):
    """A template of the project's keeps its instructions, what it applies to, its purpose and its outline."""

    kind = "template"
    title = "templates"

    def __init__(self, ledger: MigratedRows, templates: Templates) -> None:
        super().__init__(ledger)
        self.templates = templates

    def made(self, row: Version3Row, by: Actor) -> Template:
        parts = tuple(f"{title}: {body}" for title, body in row.sections)
        return self.templates.imported(Template(title=row.title, applies_to=tuple(row.listed("applies_to")), purpose=row.data.get("purpose", ""), brief=row.brief, parts=parts), row.made_at(), by)
