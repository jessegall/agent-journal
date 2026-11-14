from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.tunnel.commands.tunnel_status.tunnel_status_subcommand import TunnelStatusSubcommand
from engine.module.module import Module
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from core.modules.tunnel.guards.tunnel_service_guard import TunnelServiceGuard
from core.modules.tunnel.support.no_tunnel import NoTunnel
from core.modules.tunnel.support.skeletons import TUNNEL_TUNNEL_SKELETON


class TunnelModule(Module):
    """Chooses the tunnel through which a phone or a share link reaches this computer, and ships none by
    default."""

    name = "journal.core.tunnel"
    seed_reason = "it keeps no rows, only a service the settings choose"
    move_reason = "version 4 kept its tunnel in settings, which the settings module moves"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = [SettingValue("service", "Tunnel service", "Which installed tunnel a phone or a share link reaches this computer through.",
                             SettingType.TEXT, default="none", scope=SettingScope.PROJECT)]
    tunnels = [NoTunnel]
    guards = [TunnelServiceGuard]
    subcommands = [TunnelStatusSubcommand]
    windows = [WindowDeclaration("tunnel.tunnel", "Tunnel", "tunnel.js", WindowLoading.COMPONENT, skeleton=TUNNEL_TUNNEL_SKELETON, group="project", place=WindowPlace.PAGE, icon=WindowIcon.SHARE, reads=["tunnel status"], keys=[WindowKey("status", "tunnel status")])]
