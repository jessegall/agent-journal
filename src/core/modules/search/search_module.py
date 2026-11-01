from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.search.commands.search_find.search_find_subcommand import SearchFindSubcommand


class SearchModule(Module):
    """Adds search: the rows of every model that names its search fields, found by the terms they hold."""

    name = "journal.core.search"
    move_reason = "version 4 search kept no rows of its own"
    seed_reason = "it reads the rows the other modules seed"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    subcommands = [SearchFindSubcommand]
    windows = [WindowDeclaration("search.search", "Search", "search.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, icon=WindowIcon.SEARCH, reads=["search find"])]
