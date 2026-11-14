from engine.database.write_turns import WriteTurns
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.tunnel.tunnel import Tunnel
from engine.enums.tunnel_state import TunnelState
from engine.setting.setting_values import SettingValues
from core.modules.tunnel.support.tunnels import SERVICE_SETTING, Tunnels


class ServerTunnel:
    """The tunnel the server keeps open for the viewer's port: the one the tunnel service setting chooses,
    opened when the server starts, opened again when it has dropped or the choice or its place changes, closed
    when the server stops. No row keeps its address, which may change after a restart; the address is read
    from
    here when a link is shown."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home, self.turns = home, turns
        self.current: Tunnel | None = None
        self.place = ""

    def follow(self, port: int) -> None:
        container = synced_container(self.home, self.turns)
        try:
            name = container.get(SettingValues).project.text(SERVICE_SETTING)
            tunnel = container.get(Tunnels).tunnel(name)
            if self.current is not None and self.current.name == name and self.place == tunnel.place() and self.current.state() is not TunnelState.DISCONNECTED:
                return
            self.close()
            self.current, self.place = tunnel, tunnel.place()
            self.current.open(port)
        finally:
            container.get(Database).close()

    def address(self) -> str | None:
        return self.current.address() if self.current is not None else None

    def close(self) -> None:
        if self.current is not None:
            self.current.close()
            self.current = None
