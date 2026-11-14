from engine.viewer.window import Window
from core.modules.documents.support.doc_searcher import DocSearcher
from core.modules.documents.support.skeletons import DOCUMENTS_DOCUMENTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.documents.windows.page.keys.library_key import LibraryKey


class PageWindow(Window):
    """The Document reader window."""

    name = "documents.page"
    title = "Document reader"
    entry = "document-page.js"
    loading = WindowLoading.COMPONENT
    skeleton = DOCUMENTS_DOCUMENTS_SKELETON
    search = WindowSearch(DocSearcher, "Search titles and abstracts")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.DOCUMENT
    reads = ["document library", "doc show", "report show", "doc inspect", "report inspect", "doc comments", "report comments", "doc revisions", "doc revision", "question list", "link list"]
    runs = ["doc make", "report make", "doc comment", "report comment", "doc close", "doc edit", "report edit", "report close"]
    events = ["doc.*", "report.*", "question.*"]
    shared_reads = ["doc show id", "report show id"]
    keys = [LibraryKey]
