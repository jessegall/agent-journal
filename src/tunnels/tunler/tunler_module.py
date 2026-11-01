from core.base.module.module import Module
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from tunnels.tunler.commands.install_tunler.install_tunler_handler import InstallTunlerHandler
from tunnels.tunler.commands.install_tunler.install_tunler_subcommand import InstallTunlerSubcommand
from tunnels.tunler.commands.log_in_tunler.log_in_tunler_handler import LogInTunlerHandler
from tunnels.tunler.commands.log_in_tunler.log_in_tunler_subcommand import LogInTunlerSubcommand
from tunnels.tunler.commands.log_out_tunler.log_out_tunler_handler import LogOutTunlerHandler
from tunnels.tunler.commands.log_out_tunler.log_out_tunler_subcommand import LogOutTunlerSubcommand
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain_handler import ReleaseTunlerDomainHandler
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain_subcommand import ReleaseTunlerDomainSubcommand
from tunnels.tunler.commands.tunler_domains.tunler_domains_subcommand import TunlerDomainsSubcommand
from tunnels.tunler.commands.tunler_status.tunler_status_subcommand import TunlerStatusSubcommand
from tunnels.tunler.commands.tunler_version.tunler_version_subcommand import TunlerVersionSubcommand
from tunnels.tunler.commands.update_tunler.update_tunler_handler import UpdateTunlerHandler
from tunnels.tunler.commands.update_tunler.update_tunler_subcommand import UpdateTunlerSubcommand
from tunnels.tunler.tunler_tunnel import TunlerTunnel


class TunlerModule(Module):
    """Reaches this computer through the tunler program, logged in on this machine from its window or with tunler login."""

    name = "journal.tunnels.tunler"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tunnel"]
    settings = [SettingValue("subdomain", "Subdomain", "The name in front of the tunler server's address that reaches this journal.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT)]
    tunnels = [TunlerTunnel]
    subcommands = [TunlerStatusSubcommand, TunlerDomainsSubcommand, TunlerVersionSubcommand, LogInTunlerSubcommand, LogOutTunlerSubcommand,
                   UpdateTunlerSubcommand, InstallTunlerSubcommand, ReleaseTunlerDomainSubcommand]
    handlers = [LogInTunlerHandler, LogOutTunlerHandler, UpdateTunlerHandler, InstallTunlerHandler, ReleaseTunlerDomainHandler]
    windows = [WindowDeclaration("tunler.account", "Tunler", "tunler.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.SHARE,
                                 reads=["tunler status", "tunler domains", "tunler version"],
                                 runs=["tunler login", "tunler logout", "tunler update", "tunler install", "tunler release", "setting set"])]
