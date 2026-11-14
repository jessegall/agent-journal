from engine.viewer.window import Window
from core.modules.memories.support.memory_searcher import MemorySearcher
from core.modules.memories.support.skeletons import MEMORIES_MEMORIES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.memories.windows.memories.keys.memories_key import MemoriesKey
from core.modules.memories.windows.memories.keys.keywords_key import KeywordsKey


class MemoriesWindow(Window):
    """The Memories window."""

    name = "memories.memories"
    title = "Memories"
    entry = "memories.js"
    loading = WindowLoading.COMPONENT
    skeleton = MEMORIES_MEMORIES_SKELETON
    search = WindowSearch(MemorySearcher, "Search the memories")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.FILED
    reads = ["memory list", "memory page", "memory-keyword list"]
    runs = ["memory weigh", "memory edit", "memory remove", "memory restore", "memory-keyword make", "memory-keyword delete"]
    events = ["memory.*", "memory_keyword.*"]
    keys = [MemoriesKey, KeywordsKey]
