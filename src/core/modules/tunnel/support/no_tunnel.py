from core.base.tunnel.tunnel import Tunnel
from core.base.tunnel.tunnel_state import TunnelState


class NoTunnel(Tunnel):
    """The tunnel when none is chosen: never up and with no outside address, so links give the local address."""

    name = "none"
    title = "No tunnel"

    def open(self, port: int) -> None:
        return

    def address(self) -> str | None:
        return None

    def state(self) -> TunnelState:
        return TunnelState.DISCONNECTED

    def reason(self) -> str:
        return "no tunnel service is chosen: journal setting set journal.core.tunnel.service <name> --project chooses one"

    def close(self) -> None:
        return
