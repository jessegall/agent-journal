from typing import ClassVar

from core.base.tunnel.tunnel_state import TunnelState


class Tunnel:
    """A way for a phone or a share link to reach this computer's viewer from outside: a module declares one, the
    setting of the tunnel module chooses it, and the rest of the journal knows only this contract."""

    name: ClassVar[str]
    title: ClassVar[str]

    def open(self, port: int) -> None:
        raise NotImplementedError

    def address(self) -> str | None:
        raise NotImplementedError

    def state(self) -> TunnelState:
        raise NotImplementedError

    def reason(self) -> str:
        raise NotImplementedError

    def close(self) -> None:
        raise NotImplementedError
