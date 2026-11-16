from engine.viewer.window import Window
from core.modules.settings.support.skeletons import SETTINGS_SETTINGS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_read_search import WindowReadSearch
from core.modules.settings.windows.settings.keys.settings_key import SettingsKey
from core.modules.settings.windows.settings.keys.sections_key import SectionsKey
from core.modules.settings.windows.settings.keys.environments_key import EnvironmentsKey
from core.modules.settings.windows.settings.keys.commands_key import CommandsKey


class SettingsWindow(Window):
    """The Settings window."""

    name = "settings.settings"
    title = "Settings"
    entry = "settings.js"
    loading = WindowLoading.COMPONENT
    skeleton = SETTINGS_SETTINGS_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.MENU
    search = WindowReadSearch("setting tree", "Find a setting", ("title", "description", "key"))
    reads = ["setting tree", "suite sections", "environment list", "environment cards", "alias saved"]
    runs = ["setting set", "setting switch", "environment delete"]
    events = ["setting.*", "environment.*", "alias.*"]
    keys = [SettingsKey, SectionsKey, EnvironmentsKey, CommandsKey]
