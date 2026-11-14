from tunnels.tunler.windows.tunler_windows import TUNLER_WINDOWS
from tunnels.tunler.settings.tunler_setting_values import TunlerSettingValues
from engine.module.module import Module
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


class TunlerModule(Module):
    """Reaches this computer through the tunler program, logged in on this machine from its window or with
    tunler login."""

    name = "journal.tunnels.tunler"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.tunnel", "journal.core.settings", "journal.core.agents"]
    settings = [TunlerSettingValues]
    tunnels = [TunlerTunnel]
    subcommands = [TunlerStatusSubcommand, TunlerDomainsSubcommand, TunlerVersionSubcommand, LoginTunlerSubcommand, LogoutTunlerSubcommand,
                   UpdateTunlerSubcommand, InstallTunlerSubcommand, ReleaseTunlerDomainSubcommand]
    handlers = [LoginTunlerHandler, LogoutTunlerHandler, UpdateTunlerHandler, InstallTunlerHandler, ReleaseTunlerDomainHandler]
    windows = TUNLER_WINDOWS
