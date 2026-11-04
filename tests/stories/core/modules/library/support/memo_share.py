from core.base.library.library_share import Fields, LibraryShare
from core.base.module.module import Module
from core.modules.documents.models.doc import Doc

PATH = "tests.stories.core.modules.library.support.memo_share"
INTERNAL_REASON = "this comes with the journal"


class MemoShare(LibraryShare[Doc]):
    """Shares documents under the name memo, and refuses one whose abstract starts with Internal."""

    name = "memo"
    model = Doc

    def fields(self, row: Doc) -> Fields:
        return {"title": row.title, "abstract": row.abstract, "body": row.body}

    def share_refusal(self, row: Doc) -> str:
        return INTERNAL_REASON if row.abstract.startswith("Internal") else ""


class MemoShareModule(Module):
    name = "memoshare"
    requires_core = ">=5,<6"
    library_shares = [MemoShare]
