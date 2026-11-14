from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.tunnel.support.tunnel_status import TunnelStatus
from core.modules.tunnel.support.tunnels import Tunnels


class TunnelStatusSubcommand(ReadSubcommand[TunnelStatus]):
    """`journal tunnel status`: whether the chosen tunnel is connected, its address, and why not."""

    cli_name = "tunnel"
    name = "status"

    def __init__(self, tunnels: Tunnels) -> None:
        self.tunnels = tunnels

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> TunnelStatus:
        tunnel = self.tunnels.chosen()
        return TunnelStatus(tunnel.state().value, tunnel.address(), tunnel.reason())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TunnelStatus):
            output.write(f"{value.state}: {value.address or value.reason}", value.json())
