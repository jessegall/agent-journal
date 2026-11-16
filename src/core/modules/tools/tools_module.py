from core.modules.tools.declarations.tools_subcommands import TOOLS_SUBCOMMANDS
from core.modules.tools.windows.tools_windows import TOOLS_WINDOWS
from engine.module.module import Module
from core.modules.tools.commands.install_tool.install_tool_handler import InstallToolHandler
from core.modules.tools.commands.refresh_tool.refresh_tool_handler import RefreshToolHandler
from core.modules.tools.commands.set_tool.set_tool_handler import SetToolHandler


class ToolsModule(Module):
    """Adds the tools the loaded suites ship: a card for each on the Tools page to install, turn on or off and
    refresh, and a managed hook, held for every agent program while a tool is on, that refreshes the tool's
    output in the background after each new commit. Each tool comes from the suite that binds ToolRunners."""

    name = "journal.core.tools"
    seed_reason = "a demo installs no tool"
    move_reason = "version 4 had no tools rows"
    requires_engine = ">=6,<7"
    file_events = ["tool.changed"]
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.drivers"]
    handlers = [SetToolHandler, InstallToolHandler, RefreshToolHandler]
    subcommands = TOOLS_SUBCOMMANDS
    windows = TOOLS_WINDOWS
