from core.base.module.module import Module
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare

PATH = "tests.stories.core.modules.library.support.paused_share"


class PausedShare(DocLibraryShare):
    """Shares documents under the name sequence, and always pauses a newer version, as a sequence does while it
    runs."""

    name = "sequence"

    def is_paused(self, row: Doc) -> bool:
        return True


class PausedShareModule(Module):
    name = "pausedshare"
    requires_core = ">=5,<6"
    library_shares = [PausedShare]
