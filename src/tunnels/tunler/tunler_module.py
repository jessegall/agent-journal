from core.base.module.module import Module
from engine.setting.setting_scope import SettingScope
from engine.setting.setting_type import SettingType
from engine.setting.setting_value import SettingValue
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from tunnels.tunler.commands.install_tunler.install_tunler_handler import InstallTunlerHandler
from tunnels.tunler.commands.install_tunler.install_tunler_subcommand import InstallTunlerSubcommand
from tunnels.tunler.commands.login_tunler.login_tunler_handler import LoginTunlerHandler
from tunnels.tunler.commands.login_tunler.login_tunler_subcommand import LoginTunlerSubcommand
from tunnels.tunler.commands.logout_tunler.logout_tunler_handler import LogoutTunlerHandler
from tunnels.tunler.commands.logout_tunler.logout_tunler_subcommand import LogoutTunlerSubcommand
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain_handler import ReleaseTunlerDomainHandler
from tunnels.tunler.commands.release_tunler_domain.release_tunler_domain_subcommand import ReleaseTunlerDomainSubcommand
from tunnels.tunler.commands.tunler_domains.tunler_domains_subcommand import TunlerDomainsSubcommand
from tunnels.tunler.commands.tunler_status.tunler_status_subcommand import TunlerStatusSubcommand
from tunnels.tunler.commands.tunler_version.tunler_version_subcommand import TunlerVersionSubcommand
from tunnels.tunler.commands.update_tunler.update_tunler_handler import UpdateTunlerHandler
from tunnels.tunler.commands.update_tunler.update_tunler_subcommand import UpdateTunlerSubcommand
from tunnels.tunler.support.tunler_tunnel import TunlerTunnel
from tunnels.tunler.support.skeletons import TUNLER_ACCOUNT_SKELETON


class TunlerModule(Module):
    """Reaches this computer through the tunler program, logged in on this machine from its window or with
    tunler login."""

    name = "journal.tunnels.tunler"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tunnel", "journal.core.settings", "journal.core.agents"]
    settings = [SettingValue("subdomain", "Subdomain", "The name in front of the tunler server's address that reaches this journal.",
                             SettingType.TEXT, default="", scope=SettingScope.PROJECT)]
    tunnels = [TunlerTunnel]
    subcommands = [TunlerStatusSubcommand, TunlerDomainsSubcommand, TunlerVersionSubcommand, LoginTunlerSubcommand, LogoutTunlerSubcommand,
                   UpdateTunlerSubcommand, InstallTunlerSubcommand, ReleaseTunlerDomainSubcommand]
    handlers = [LoginTunlerHandler, LogoutTunlerHandler, UpdateTunlerHandler, InstallTunlerHandler, ReleaseTunlerDomainHandler]
    windows = [WindowDeclaration("tunler.account", "Tunler", "tunler.js", WindowLoading.COMPONENT, skeleton=TUNLER_ACCOUNT_SKELETON, group="project", place=WindowPlace.PAGE, icon=WindowIcon.SHARE,
                                 reads=["tunler status", "tunler domains", "tunler version"],
                                 keys=[WindowKey("status", "tunler status"), WindowKey("version", "tunler version"), WindowKey("domains", "tunler domains")],
                                 runs=["tunler login", "tunler logout", "tunler update", "tunler install", "tunler release", "setting set"])]
