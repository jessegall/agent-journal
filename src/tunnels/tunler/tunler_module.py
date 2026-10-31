from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from tunnels.tunler.tunler_tunnel import TunlerTunnel


class TunlerModule(Module):
    """Reaches this computer through the tunler program, logged in on this machine with tunler login."""

    name = "journal.tunnels.tunler"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tunnel"]
    settings = [SettingValue("subdomain", "Subdomain", "The name in front of the tunler server's address that reaches this journal.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT)]
    tunnels = [TunlerTunnel]
