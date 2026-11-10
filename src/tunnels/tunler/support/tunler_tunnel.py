from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.base.tunnel.tunnel import Tunnel
from core.base.tunnel.tunnel_state import TunnelState
from core.modules.settings.bindings.support.setting_values import SettingValues
from tunnels.tunler.support.tunler_client import TunlerClient


CONNECT_LIMIT_SECONDS = 60
SUBDOMAIN_SETTING = "journal.tunnels.tunler.subdomain"


class TunlerTunnel(Tunnel):
    """The tunnel through the tunler program, under the subdomain its setting names."""

    name = "tunler"
    title = "Tunler"

    def __init__(self, client: TunlerClient, settings: SettingValues, clock: Clock) -> None:
        self.client, self.settings, self.clock = client, settings, clock
        self.opened_at: Timestamp | None = None
        self.problem = ""

    def place(self) -> str:
        return self.settings.project.text(SUBDOMAIN_SETTING)

    def open(self, port: int) -> None:
        self.problem = self.obstacle()
        if not self.problem:
            self.client.start(port, self.place())
            self.opened_at = self.clock.timestamp()

    def obstacle(self) -> str:
        status = self.client.status()
        if not self.place():
            return f"name the subdomain with journal setting set {SUBDOMAIN_SETTING} <name> --project"
        if not status.installed:
            return "tunler is not installed on this machine"
        if not status.authenticated:
            return "this machine is not logged in to Tunler: sign in on the Tunler page"
        return ""

    def address(self) -> str | None:
        return self.client.address() if self.state() is not TunnelState.DISCONNECTED else None

    def state(self) -> TunnelState:
        state = self.client.state()
        if self.opened_at is None:
            return state
        if state is TunnelState.DISCONNECTED:
            self.problem = " ".join(("tunler stopped:", self.client.last_line())).strip().removesuffix(":")
            self.opened_at = None
        elif state is TunnelState.RECONNECTING and self.client.address() is None and self.opened_at.elapsed_seconds(self.clock.timestamp()) > CONNECT_LIMIT_SECONDS:
            self.close()
            self.problem = f"tunler did not connect within {CONNECT_LIMIT_SECONDS} seconds"
            return TunnelState.DISCONNECTED
        return state

    def reason(self) -> str:
        return self.problem or (self.obstacle() if self.client.state() is TunnelState.DISCONNECTED else "")

    def close(self) -> None:
        self.client.stop()
        self.opened_at = None
