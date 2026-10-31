from core.base.module.module import Module
from core.base.tunnel.tunnel import Tunnel
from core.base.tunnel.tunnel_state import TunnelState

PATH = "tests.stories.core.base.tunnel.support.tunnel_samples"
SAMPLE_ADDRESS = "https://sample.tunnel.example"


class SampleTunnel(Tunnel):
    """A tunnel that answers at once with a fixed address and reaches no network."""

    name = "sample"
    title = "Sample tunnel"

    def __init__(self) -> None:
        self.opened_port: int | None = None

    def open(self, port: int) -> None:
        self.opened_port = port

    def address(self) -> str | None:
        return SAMPLE_ADDRESS if self.opened_port is not None else None

    def state(self) -> TunnelState:
        return TunnelState.CONNECTED if self.opened_port is not None else TunnelState.DISCONNECTED

    def close(self) -> None:
        self.opened_port = None


class SampleTunnelModule(Module):
    name = "sampletunnel"
    requires_core = ">=5,<6"
    tunnels = [SampleTunnel]
