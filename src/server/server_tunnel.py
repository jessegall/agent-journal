from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.tunnel.tunnel import Tunnel
from core.base.tunnel.tunnel_state import TunnelState
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tunnel.support.tunnels import SERVICE_SETTING, Tunnels


class ServerTunnel:
    """The tunnel the server keeps open for the viewer's port: the one the tunnel service setting chooses,
    opened when the server starts, opened again when it has dropped or the choice changes, closed when the
    server stops. No row keeps its address, which may change after a restart; the address is read from here
    when a link is shown."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.current: Tunnel | None = None

    def follow(self, port: int) -> None:
        container = synced_container(self.home)
        try:
            name = container.get(SettingValues).text(SERVICE_SETTING, None)
            if self.current is not None and self.current.name == name and self.current.state() is not TunnelState.DISCONNECTED:
                return
            self.close()
            self.current = container.get(Tunnels).tunnel(name)
            self.current.open(port)
        finally:
            container.get(Database).close()

    def address(self) -> str | None:
        return self.current.address() if self.current is not None else None

    def close(self) -> None:
        if self.current is not None:
            self.current.close()
            self.current = None
