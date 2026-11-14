from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart
from core.modules.memories.windows.memory_facts.keys.keywords_key import KeywordsKey


class MemoryFactsWindow(Window):
    """The Keywords window."""

    name = "memories.memory-facts"
    title = "Keywords"
    entry = "memory-facts.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.FILED
    skeleton = [SkeletonPart.line()]
    reads = ["memory-keyword list"]
    runs = ["memory-keyword make", "memory-keyword delete"]
    events = ["memory_keyword.*"]
    keys = [KeywordsKey]
