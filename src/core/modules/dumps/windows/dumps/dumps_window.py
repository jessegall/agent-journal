from engine.viewer.window import Window
from core.modules.dumps.support.dump_searcher import DumpSearcher
from core.modules.dumps.support.skeletons import DUMPS_DUMPS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.dumps.windows.dumps.keys.dumps_key import DumpsKey


class DumpsWindow(Window):
    """The Dumps window."""

    name = "dumps.dumps"
    title = "Dumps"
    entry = "dumps.js"
    loading = WindowLoading.COMPONENT
    skeleton = DUMPS_DUMPS_SKELETON
    search = WindowSearch(DumpSearcher, "Search the dumps")
    place = WindowPlace.PANE
    icon = WindowIcon.FILED
    reads = ["dump board", "dump-item board"]
    runs = ["dump name"]
    events = ["dump.*", "dump_item.*"]
    keys = [DumpsKey]
