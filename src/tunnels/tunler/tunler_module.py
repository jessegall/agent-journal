from tunnels.tunler.declarations.tunler_subcommands import TUNLER_SUBCOMMANDS
from tunnels.tunler.declarations.tunler_handlers import TUNLER_HANDLERS
from tunnels.tunler.windows.tunler_windows import TUNLER_WINDOWS
from tunnels.tunler.settings.tunler_setting_values import TunlerSettingValues
from engine.module.module import Module
from tunnels.tunler.support.tunler_tunnel import TunlerTunnel


class TunlerModule(Module):
    """Reaches this computer through the tunler program, logged in on this machine from its window or with
    tunler login."""

    name = "journal.tunnels.tunler"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.tunnel", "journal.core.settings", "journal.core.agents"]
    settings = [TunlerSettingValues]
    tunnels = [TunlerTunnel]
    subcommands = TUNLER_SUBCOMMANDS
    handlers = TUNLER_HANDLERS
    windows = TUNLER_WINDOWS
