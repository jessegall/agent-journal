from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tunnel.support.tunnels import SERVICE_SETTING
from tunnels.tunler.support.tunler_account import TunlerAccount
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_tunnel import SUBDOMAIN_SETTING, TunlerTunnel


class TunlerStatusSubcommand(ReadSubcommand[TunlerAccount]):
    """`journal tunler status`: whether tunler is installed and logged in, as whom and where, and whether this
    journal uses it."""

    cli_name = "tunler"
    name = "status"

    def __init__(self, client: TunlerClient, settings: SettingValues) -> None:
        self.client, self.settings = client, settings

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> TunlerAccount:
        status = self.client.status()
        return TunlerAccount(status.installed, status.authenticated, status.rejected, status.account, status.host, status.command,
                             self.settings.project.text(SUBDOMAIN_SETTING), self.settings.project.text(SERVICE_SETTING) == TunlerTunnel.name)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunlerAccount):
            output.write(f"{value.account} on {value.host}" if value.authenticated else "not logged in to tunler", value.json())
