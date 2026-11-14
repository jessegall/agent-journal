from engine.viewer.window import Window
from core.modules.library.support.skeletons import LIBRARY_TEAMS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.library.windows.teams.keys.status_key import StatusKey
from core.modules.library.windows.teams.keys.copies_key import CopiesKey
from core.modules.library.windows.teams.keys.users_key import UsersKey
from core.modules.library.windows.teams.keys.tokens_key import TokensKey
from core.modules.library.windows.teams.keys.item_key import ItemKey
from core.modules.library.windows.teams.keys.inspection_key import InspectionKey
from core.modules.library.windows.teams.keys.listing_key import ListingKey


class TeamsWindow(Window):
    """The Teams window."""

    name = "library.teams"
    title = "Teams"
    entry = "teams.js"
    loading = WindowLoading.COMPONENT
    skeleton = LIBRARY_TEAMS_SKELETON
    search = WindowReadSearch("library list", "Search the library", ("title", "abstract"))
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.SHARE
    reads = ["library status", "library list", "library browse", "library inspect", "library show", "library copies", "library-user list", "library-user tokens"]
    runs = ["library connect", "library get", "library share", "library sync", "library resolve", "library leave", "library remove", "library restore", "library-user add", "library-user role", "library-user remove", "library-user revoke"]
    events = ["library_connection.*", "library_copy.*"]
    keys = [StatusKey, CopiesKey, UsersKey, TokensKey, ItemKey, InspectionKey, ListingKey]
