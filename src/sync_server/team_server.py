import threading
from http.server import ThreadingHTTPServer
from pathlib import Path

from sync_server.accounts import Accounts
from sync_server.change_log import ChangeLog
from sync_server.copy_handler import CopyHandler
from sync_server.db.account_rows import AccountRows
from sync_server.db.change_rows import ChangeRows
from sync_server.db.device_rows import DeviceRows
from sync_server.db.failed_login_rows import FailedLoginRows
from sync_server.db.id_block_rows import IdBlockRows
from sync_server.db.row_values import RowValues
from sync_server.db.server_schema import ServerSchema
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.id_ranges import IdRanges
from sync_server.login_handler import LoginHandler
from sync_server.pull_handler import PullHandler
from sync_server.push_handler import PushHandler
from sync_server.server_clock import ServerClock
from sync_server.team_request_handler import TeamRequestHandler

DATABASE = "team.db"


class TeamServer:
    """The team server put together over one database in its data folder, and its threaded HTTP server, so a pull held open never stops another request."""

    def __init__(self, data: Path) -> None:
        self.store = Store(data / DATABASE)
        ServerSchema(self.store).migrated()
        self.clock = ServerClock()
        self.accounts = Accounts(AccountRows(self.store))
        self.devices = Devices(DeviceRows(self.store), FailedLoginRows(self.store), self.accounts)
        self.log = ChangeLog(self.store, ChangeRows(self.store), RowValues(self.store))
        self.ranges = IdRanges(self.store, IdBlockRows(self.store))
        self.logins = LoginHandler(self.devices, self.clock)
        self.pushes = PushHandler(self.log, self.devices)
        self.pulls = PullHandler(self.log, self.devices, self.clock)
        self.copies = CopyHandler(self.store, self.log, self.devices, self.clock)

    def http(self, host: str, port: int) -> ThreadingHTTPServer:
        server = ThreadingHTTPServer((host, port), TeamRequestHandler)
        server.daemon_threads = True
        server.team = self
        return server

    def started(self, host: str, port: int) -> ThreadingHTTPServer:
        server = self.http(host, port)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        return server
