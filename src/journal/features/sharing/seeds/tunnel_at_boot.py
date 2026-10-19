from journal.features.seed import Seed
from journal.features.sharing.support.tunnel import Tunnel


class TunnelAtBoot(Seed):
    """At boot, the tunnel is started where a supervisor runs and a link is open; one already running for the same address is left as it is."""

    def __init__(self, tunnel: Tunnel) -> None:
        self.tunnel = tunnel

    def run(self) -> None:
        self.tunnel.settle()
