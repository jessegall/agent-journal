from core.base.clock import Clock
from core.base.timestamp import Timestamp
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

    def open(self, port: int) -> None:
        subdomain = self.settings.text(SUBDOMAIN_SETTING, None)
        status = self.client.status()
        if not subdomain:
            self.problem = f"name the subdomain with journal setting set {SUBDOMAIN_SETTING} <name> --project"
        elif not status.installed:
            self.problem = "tunler is not installed on this machine"
        elif not status.authenticated:
            self.problem = "this machine is not logged in to tunler: run tunler login"
        else:
            self.problem = ""
            self.client.start(port, subdomain)
            self.opened_at = self.clock.timestamp()

    def address(self) -> str | None:
        return self.client.address() if self.state() is not TunnelState.DISCONNECTED else None

    def state(self) -> TunnelState:
        if self.opened_at is None:
            return TunnelState.DISCONNECTED
        state = self.client.state()
        if state is TunnelState.DISCONNECTED:
            self.problem = " ".join(("tunler stopped:", self.client.last_line())).strip().removesuffix(":")
            self.opened_at = None
        elif state is TunnelState.RECONNECTING and self.client.address() is None and self.opened_at.elapsed_seconds(self.clock.timestamp()) > CONNECT_LIMIT_SECONDS:
            self.close()
            self.problem = f"tunler did not connect within {CONNECT_LIMIT_SECONDS} seconds"
            return TunnelState.DISCONNECTED
        return state

    def reason(self) -> str:
        return self.problem

    def close(self) -> None:
        self.client.stop()
        self.opened_at = None
