from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.tunnel.guards.tunnel_service_guard import TunnelServiceGuard
from core.modules.tunnel.support.no_tunnel import NoTunnel


class TunnelModule(Module):
    """Chooses the tunnel through which a phone or a share link reaches this computer, and ships none by default."""

    name = "journal.core.tunnel"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings"]
    settings = [SettingValue("service", "Tunnel service", "Which installed tunnel a phone or a share link reaches this computer through.",
                             SettingType.TEXT, default="none", scope=SettingScope.PROJECT)]
    tunnels = [NoTunnel]
    guards = [TunnelServiceGuard]
