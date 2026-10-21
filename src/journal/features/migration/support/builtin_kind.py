from journal.features.migration.support.project_kind import ProjectKind
from journal.features.migration.support.version_3_row import Version3Row


class BuiltinKind(ProjectKind):
    """A project kind version 3 also shipped rows of: the ones it shipped stay behind, since version 4 ships its own."""

    def left_behind(self, row: Version3Row) -> str:
        return super().left_behind(row) or ("shipped with version 3" if row.data.get("system") else "")
