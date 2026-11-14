from engine.viewer.window import Window
from core.modules.search.support.skeletons import SEARCH_SEARCH_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.search.windows.search.keys.results_key import ResultsKey


class SearchWindow(Window):
    """The Search window."""

    name = "search.search"
    title = "Search"
    entry = "search.js"
    loading = WindowLoading.COMPONENT
    skeleton = SEARCH_SEARCH_SKELETON
    place = WindowPlace.PAGE
    icon = WindowIcon.SEARCH
    reads = ["search find"]
    search = WindowReadSearch("search find", "Search the journal")
    keys = [ResultsKey]
