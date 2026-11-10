from engine.viewer.window_read_search import WindowReadSearch
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from engine.viewer.window_key import WindowKey
from engine.viewer.key_loading import KeyLoading
from engine.viewer.window_place import WindowPlace
from core.modules.search.commands.search_find.search_find_subcommand import SearchFindSubcommand
from core.modules.search.listeners.search_mark_listener import SearchMarkListener
from core.modules.search.support.search_marks import SEARCH_MARKS
from core.modules.search.support.skeletons import SEARCH_SEARCH_SKELETON


class SearchModule(Module):
    """Adds search: the rows of every model that names its search fields, found by the terms they hold, and the chat
    mark of an agent's search."""

    name = "journal.core.search"
    move_reason = "version 4 search kept no rows of its own"
    seed_reason = "it reads the rows the other modules seed"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.chat", "journal.core.drivers", "journal.core.processes"]
    subcommands = [SearchFindSubcommand]
    marks = SEARCH_MARKS
    listeners = [SearchMarkListener]
    windows = [WindowDeclaration("search.search", "Search", "search.js", WindowLoading.COMPONENT, skeleton=SEARCH_SEARCH_SKELETON, place=WindowPlace.PAGE, icon=WindowIcon.SEARCH, reads=["search find"], keys=[WindowKey("results", "search find {terms} --split-terms", arguments=["model"], loading=KeyLoading.REQUESTED)], search=WindowReadSearch("search find", "Search the journal"))]
