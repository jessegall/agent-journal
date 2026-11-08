from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.tools.commands.install_tool.install_tool_handler import InstallToolHandler
from core.modules.tools.commands.install_tool.install_tool_subcommand import InstallToolSubcommand
from core.modules.tools.commands.refresh_tool.refresh_tool_handler import RefreshToolHandler
from core.modules.tools.commands.refresh_tool.refresh_tool_subcommand import RefreshToolSubcommand
from core.modules.tools.commands.refresh_tool.tool_tick_subcommand import ToolTickSubcommand
from core.modules.tools.commands.set_tool.set_tool_handler import SetToolHandler
from core.modules.tools.commands.set_tool.set_tool_off_subcommand import SetToolOffSubcommand
from core.modules.tools.commands.set_tool.set_tool_on_subcommand import SetToolOnSubcommand
from core.modules.tools.commands.tool_list.tool_list_subcommand import ToolListSubcommand
from core.modules.tools.support.skeletons import TOOLS_TOOLS_SKELETON
from core.modules.tools.support.tool_settings import TOOL_SETTINGS


class ToolsModule(Module):
    """Adds the tools the journal supports, starting with Graphify: a card for each on the Tools page to install,
    turn on or off and refresh, and a managed hook, held for every agent program while a tool is on, that
    refreshes Graphify's graph in the background after each new commit."""

    name = "journal.core.tools"
    seed_reason = "a demo installs no tool"
    requires_core = ">=5,<6"
    file_events = ["tool.changed"]
    dependencies = ["journal.core.actors", "journal.core.settings"]
    settings = TOOL_SETTINGS
    handlers = [SetToolHandler, InstallToolHandler, RefreshToolHandler]
    subcommands = [ToolListSubcommand, SetToolOnSubcommand, SetToolOffSubcommand, InstallToolSubcommand, RefreshToolSubcommand, ToolTickSubcommand]
    windows = [WindowDeclaration("tools.tools", "Tools", "tools.js", WindowLoading.COMPONENT, skeleton=TOOLS_TOOLS_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.MENU,
                                 reads=["tool list"], keys=[WindowKey("tools", "tool list", events=["tool.*"])], runs=["tool on", "tool off", "tool install", "tool refresh"], events=["tool.*"])]
