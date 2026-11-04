from core.base.library.library_share import Fields
from core.base.module.module import Module
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare

PATH = "tests.stories.core.modules.library.support.command_share"
WARNING = "this check runs on your computer: echo hello"


class CommandShare(DocLibraryShare):
    """Shares documents under the name check, as a check that runs a command, and warns before one is got. A closed
    document counts as a check that was removed."""

    name = "check"

    def fields(self, row: Doc) -> Fields:
        return {"title": row.title, "command": row.body, "brief": row.abstract, "interval_minutes": 5}

    def is_removed(self, row: Doc) -> bool:
        return bool(row.close_reason)

    def warning(self, fields: Fields) -> str:
        return WARNING

    @staticmethod
    def columns(fields: Fields) -> dict[str, str]:
        return {"title": str(fields["title"]), "abstract": str(fields["brief"]), "body": str(fields["command"])}


class CommandShareModule(Module):
    name = "commandshare"
    requires_core = ">=5,<6"
    library_shares = [CommandShare]
