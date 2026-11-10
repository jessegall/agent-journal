from engine.tunnel.tunnel import Tunnel
# @sin architecture_tunnels_tunnel_module_imported_outside_tunnels
from tunnels.sample_link.sample_link_module import SampleLinkModule


class SampleShareAddress:
    """A sample that reaches a tunnel past its contract."""

    def __init__(self, tunnel: Tunnel) -> None:
        self.tunnel = tunnel

    def is_public(self) -> bool:
        # @sin architecture_tunnels_tunnel_named_outside_tunnels
        return self.tunnel.name == "tunler" and SampleLinkModule.name != ""

    def address(self) -> str | None:
        return self.tunnel.address()
