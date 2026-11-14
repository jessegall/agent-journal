from engine.viewer.window import Window
from core.modules.mcp.support.server_searcher import ServerSearcher
from core.modules.mcp.support.skeletons import MCP_INTEGRATIONS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.mcp.windows.integrations.keys.installed_key import InstalledKey
from core.modules.mcp.windows.integrations.keys.suggested_key import SuggestedKey
from core.modules.mcp.windows.integrations.keys.check_key import CheckKey


class IntegrationsWindow(Window):
    """The Integrations window."""

    name = "mcp.integrations"
    title = "Integrations"
    entry = "integrations.js"
    loading = WindowLoading.COMPONENT
    skeleton = MCP_INTEGRATIONS_SKELETON
    search = WindowSearch(ServerSearcher, "Search the servers")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.PLUGIN
    reads = ["mcp list", "mcp suggested", "mcp check"]
    events = ["mcp_server.*"]
    runs = ["mcp add", "mcp install", "mcp key", "mcp remove", "message send"]
    keys = [InstalledKey, SuggestedKey, CheckKey]
