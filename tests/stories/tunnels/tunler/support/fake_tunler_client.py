from core.base.tunnel.tunnel_state import TunnelState
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_status import TunlerStatus

TUNLER_HOST = "journal.tunler.example"


class FakeTunlerClient(TunlerClient):
    """A tunler that runs nothing and reaches no network: it records what it was asked to start and stop, and
    answers the connection a story sets."""

    def __init__(self, installed: bool = True, authenticated: bool = True, connects: bool = True) -> None:
        self.installed, self.authenticated, self.connects = installed, authenticated, connects
        self.subdomain: str | None = None
        self.connection = TunnelState.DISCONNECTED
        self.exit_line = ""
        self.started: list[tuple[int, str]] = []
        self.stopped = 0

    def status(self) -> TunlerStatus:
        return TunlerStatus(self.installed, self.authenticated)

    def start(self, port: int, subdomain: str) -> None:
        self.started.append((port, subdomain))
        self.subdomain = subdomain
        self.connection = TunnelState.CONNECTED if self.connects else TunnelState.RECONNECTING

    def state(self) -> TunnelState:
        return self.connection

    def address(self) -> str | None:
        return f"https://{self.subdomain}.{TUNLER_HOST}" if self.subdomain is not None and self.connects else None

    def last_line(self) -> str:
        return self.exit_line

    def stop(self) -> None:
        self.stopped += 1
        self.connection = TunnelState.DISCONNECTED
        self.subdomain = None
