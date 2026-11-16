from core.modules.tunnel.windows.tunnel_windows import TUNNEL_WINDOWS
from core.modules.tunnel.settings.tunnel_setting_values import TunnelSettingValues
from core.modules.tunnel.commands.tunnel_status.tunnel_status_subcommand import TunnelStatusSubcommand
from engine.module.module import Module
from core.modules.tunnel.guards.tunnel_service_guard import TunnelServiceGuard
from core.modules.tunnel.support.no_tunnel import NoTunnel


class TunnelModule(Module):
    """Chooses the tunnel through which a phone or a share link reaches this computer, and ships none by
    default."""

    name = "journal.core.tunnel"
    seed_reason = "it keeps no rows, only a service the settings choose"
    move_reason = "version 4 kept its tunnel in settings, which the settings module moves"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.settings"]
    settings = [TunnelSettingValues]
    tunnels = [NoTunnel]
    guards = [TunnelServiceGuard]
    subcommands = [TunnelStatusSubcommand]
    windows = TUNNEL_WINDOWS
