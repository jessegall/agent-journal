from engine.viewer.window import Window
from core.modules.updates.support.skeletons import UPDATES_UPDATES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.updates.windows.updates.keys.releases_key import ReleasesKey
from core.modules.updates.windows.updates.keys.standing_key import StandingKey
from core.modules.updates.windows.updates.keys.notes_key import NotesKey


class UpdatesWindow(Window):
    """The Updates window."""

    name = "updates.updates"
    title = "Updates"
    entry = "updates.js"
    loading = WindowLoading.COMPONENT
    skeleton = UPDATES_UPDATES_SKELETON
    group = "footer"
    place = WindowPlace.PAGE
    icon = WindowIcon.UPDATE
    reads = ["update check", "update notes", "release list"]
    runs = ["update install"]
    events = ["release.*", "release_install.*"]
    keys = [ReleasesKey, StandingKey, NotesKey]
