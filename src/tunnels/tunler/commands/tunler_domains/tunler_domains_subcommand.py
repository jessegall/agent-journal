from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.bindings.support.setting_values import SettingValues
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_domains import TunlerDomains
from tunnels.tunler.support.tunler_tunnel import SUBDOMAIN_SETTING


class TunlerDomainsSubcommand(ReadSubcommand[TunlerDomains]):
    """`journal tunler domains`: the domains of the logged-in account, naming the one this journal uses."""

    cli_name = "tunler"
    name = "domains"

    def __init__(self, client: TunlerClient, settings: SettingValues) -> None:
        self.client, self.settings = client, settings

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> TunlerDomains:
        return TunlerDomains(tuple(self.client.domains()), self.settings.project.text(SUBDOMAIN_SETTING))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunlerDomains):
            output.write("\n".join(value.names) or "no domains", value.json())
