from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_icon import WindowIcon
from engine.viewer.window_key import WindowKey
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.tools.commands.install_tool.install_tool_handler import InstallToolHandler
from core.modules.tools.commands.install_tool.install_tool_subcommand import InstallToolSubcommand
from core.modules.tools.commands.refresh_tool.refresh_tool_handler import RefreshToolHandler
from core.modules.tools.commands.refresh_tool.refresh_tool_subcommand import RefreshToolSubcommand
from core.modules.tools.commands.refresh_tool.refresh_tool_tick_subcommand import RefreshToolTickSubcommand
from core.modules.tools.commands.set_tool.set_tool_handler import SetToolHandler
from core.modules.tools.commands.set_tool.set_tool_off_subcommand import SetToolOffSubcommand
from core.modules.tools.commands.set_tool.set_tool_state_subcommand import SetToolStateSubcommand
from core.modules.tools.commands.tool_list.tool_list_subcommand import ToolListSubcommand
from core.modules.tools.support.skeletons import TOOLS_TOOLS_SKELETON


class ToolsModule(Module):
    """Adds the tools the loaded suites ship: a card for each on the Tools page to install, turn on or off and
    refresh, and a managed hook, held for every agent program while a tool is on, that refreshes the tool's output
    in the background after each new commit. Each tool comes from the suite that binds ToolRunners."""

    name = "journal.core.tools"
    seed_reason = "a demo installs no tool"
    move_reason = "version 4 had no tools rows"
    requires_core = ">=5,<6"
    file_events = ["tool.changed"]
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.drivers"]
    handlers = [SetToolHandler, InstallToolHandler, RefreshToolHandler]
    subcommands = [ToolListSubcommand, SetToolStateSubcommand, SetToolOffSubcommand, InstallToolSubcommand, RefreshToolSubcommand, RefreshToolTickSubcommand]
    windows = [WindowDeclaration("tools.tools", "Tools", "tools.js", WindowLoading.COMPONENT, skeleton=TOOLS_TOOLS_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.MENU,
                                 reads=["tool list"], keys=[WindowKey("tools", "tool list", events=["tool.*"])], runs=["tool on", "tool off", "tool install", "tool refresh"], events=["tool.*"])]
