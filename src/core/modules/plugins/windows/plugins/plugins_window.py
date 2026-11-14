from engine.viewer.window import Window
from core.modules.plugins.support.plugin_searcher import PluginSearcher
from core.modules.plugins.support.skeletons import PLUGINS_PLUGINS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.plugins.windows.plugins.keys.plugins_key import PluginsKey
from core.modules.plugins.windows.plugins.keys.dashboards_key import DashboardsKey
from core.modules.plugins.windows.plugins.keys.descriptions_key import DescriptionsKey
from core.modules.plugins.windows.plugins.keys.services_key import ServicesKey
from core.modules.plugins.windows.plugins.keys.preview_key import PreviewKey
from core.modules.plugins.windows.plugins.keys.latest_key import LatestKey
from core.modules.plugins.windows.plugins.keys.settings_key import SettingsKey
from core.modules.plugins.windows.plugins.keys.record_key import RecordKey
from core.modules.plugins.windows.plugins.keys.dashboard_key import DashboardKey
from core.modules.plugins.windows.plugins.keys.dashboard_poll_key import DashboardPollKey


class PluginsWindow(Window):
    """The Plugins window."""

    name = "plugins.plugins"
    title = "Plugins"
    entry = "plugins.js"
    loading = WindowLoading.COMPONENT
    skeleton = PLUGINS_PLUGINS_SKELETON
    search = WindowSearch(PluginSearcher, "Search the plugins")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.PLUGIN
    reads = ["plugin events", "plugin service-log", "plugin record", "plugin list", "plugin settings", "plugin services", "plugin preview", "plugin latest", "plugin dashboard", "plugin dashboards", "plugin descriptions"]
    runs = ["plugin service", "plugin upgrade", "plugin enable", "plugin disable", "plugin install", "plugin remove", "plugin configure", "message send"]
    events = ["plugin.*"]
    keys = [PluginsKey, DashboardsKey, DescriptionsKey, ServicesKey, PreviewKey, LatestKey, SettingsKey, RecordKey, DashboardKey, DashboardPollKey]
