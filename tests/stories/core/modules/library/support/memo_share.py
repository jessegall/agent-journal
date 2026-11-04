from core.base.module.module import Module
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare

PATH = "tests.stories.core.modules.library.support.memo_share"
INTERNAL_REASON = "this comes with the journal"


class MemoShare(DocLibraryShare):
    """Shares documents under the name memo, and refuses one whose abstract starts with Internal."""

    name = "memo"

    def share_refusal(self, row: Doc) -> str:
        return INTERNAL_REASON if row.abstract.startswith("Internal") else ""


class MemoShareModule(Module):
    name = "memoshare"
    requires_core = ">=5,<6"
    library_shares = [MemoShare]
