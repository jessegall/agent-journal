from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_version import TunlerVersion


class TunlerVersionSubcommand(ReadSubcommand[TunlerVersion]):
    """`journal tunler version`: the tunler on this machine, the newest its server offers, and whether an
    update waits."""

    cli_name = "tunler"
    name = "version"

    def __init__(self, client: TunlerClient) -> None:
        self.client = client

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> TunlerVersion:
        return self.client.version()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunlerVersion):
            output.write(f"current {value.current}, latest {value.latest}", value.json())
