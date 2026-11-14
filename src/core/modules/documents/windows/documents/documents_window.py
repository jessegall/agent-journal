from engine.viewer.window import Window
from core.modules.documents.support.doc_searcher import DocSearcher
from core.modules.documents.support.skeletons import DOCUMENTS_DOCUMENTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.documents.windows.documents.keys.library_key import LibraryKey


class DocumentsWindow(Window):
    """The Documents window."""

    name = "documents.documents"
    title = "Documents"
    entry = "documents.js"
    loading = WindowLoading.COMPONENT
    skeleton = DOCUMENTS_DOCUMENTS_SKELETON
    search = WindowSearch(DocSearcher, "Search titles and abstracts")
    place = WindowPlace.PANE
    group = "project"
    icon = WindowIcon.DOCUMENT
    reads = ["document library", "doc list", "report list"]
    count = "doc list"
    runs = ["doc make", "report make"]
    events = ["doc.*", "report.*"]
    keys = [LibraryKey]
