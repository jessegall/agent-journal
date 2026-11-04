import json

from core.base.library.library_share import Fields
from core.base.module.module import Module
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare

PATH = "tests.stories.core.modules.library.support.paused_share"
RUN_OPEN = "Run open"


class PausedShare(DocLibraryShare):
    """Shares documents under the name sequence, with each line of the text as a step, and pauses a newer version
    while the abstract of the document says a run is open, as a sequence does while it runs."""

    name = "sequence"

    def fields(self, row: Doc) -> Fields:
        return {"title": row.title, "steps": json.dumps(row.body.split("\n")), "step_guards": "[]"}

    def is_paused(self, row: Doc) -> bool:
        return row.abstract == RUN_OPEN

    @staticmethod
    def columns(fields: Fields) -> dict[str, str]:
        return {"title": str(fields["title"]), "abstract": "Steps", "body": "\n".join(json.loads(str(fields["steps"])))}


class PausedShareModule(Module):
    name = "pausedshare"
    requires_core = ">=5,<6"
    library_shares = [PausedShare]
