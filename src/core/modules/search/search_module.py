from core.modules.search.declarations.search_dependencies import SEARCH_DEPENDENCIES
from core.modules.search.windows.search_windows import SEARCH_WINDOWS
from engine.module.module import Module
from core.modules.search.commands.search_find.search_find_subcommand import SearchFindSubcommand
from core.modules.search.listeners.search_mark_listener import SearchMarkListener
from core.modules.search.marks.search_mark import SearchMark


class SearchModule(Module):
    """Adds search: the rows of every model that names its search fields, found by the terms they hold, and the chat
    mark of an agent's search."""

    name = "journal.core.search"
    move_reason = "version 4 search kept no rows of its own"
    seed_reason = "it reads the rows the other modules seed"
    requires_engine = ">=7,<8"
    dependencies = SEARCH_DEPENDENCIES
    subcommands = [SearchFindSubcommand]
    marks = [SearchMark]
    listeners = [SearchMarkListener]
    windows = SEARCH_WINDOWS
