import threading
from http.server import ThreadingHTTPServer
from pathlib import Path

from sync_server.accounts import Accounts
from sync_server.admin_handler import AdminHandler
from sync_server.blocks_handler import BlocksHandler
from sync_server.db.invitation_rows import InvitationRows
from sync_server.invitations import Invitations
from sync_server.upgrade_handler import UpgradeHandler
from sync_server.upload_handler import UploadHandler
from sync_server.file_store import FileStore
from sync_server.leases import Leases
from sync_server.db.lease_rows import LeaseRows
from sync_server.team_details import TeamDetails
from sync_server.db.team_detail_rows import TeamDetailRows
from sync_server.change_log import ChangeLog
from sync_server.copy_handler import CopyHandler
from sync_server.db.account_rows import AccountRows
from sync_server.db.change_rows import ChangeRows
from sync_server.db.device_rows import DeviceRows
from sync_server.db.failed_login_rows import FailedLoginRows
from sync_server.db.id_block_rows import IdBlockRows
from sync_server.db.push_result_rows import PushResultRows
from sync_server.db.row_values import RowValues
from sync_server.db.server_schema import ServerSchema
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.id_ranges import IdRanges
from sync_server.login_handler import LoginHandler
from sync_server.people_handler import PeopleHandler
from sync_server.pull_handler import PullHandler
from sync_server.push_handler import PushHandler
from sync_server.push_results import PushResults
from sync_server.server_clock import ServerClock
from sync_server.team_request_handler import TeamRequestHandler

DATABASE = "team.db"
BACKUPS = "backups"
FILES = "files"


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
        self.invitations = Invitations(self.store, InvitationRows(self.store), self.accounts)
        self.logins = LoginHandler(self.devices, self.invitations, self.clock)
        self.blocks = BlocksHandler(self.ranges, self.devices)
        self.details = TeamDetails(TeamDetailRows(self.store), self.log)
        self.admins = AdminHandler(self.devices, self.accounts, self.invitations, self.clock, self.details)
        self.files = FileStore(data / FILES)
        self.leases = Leases(self.store, LeaseRows(self.store), self.accounts)
        self.uploads = UploadHandler(self.store, self.log, self.ranges, self.devices, self.details)
        self.pushes = PushHandler(self.store, self.log, self.devices, PushResults(PushResultRows(self.store)))
        self.pulls = PullHandler(self.log, self.devices, self.clock, self.details)
        self.people = PeopleHandler(self.accounts, self.devices)
        self.copies = CopyHandler(self.store, self.log, self.devices, self.clock)
        self.upgrades = UpgradeHandler(self.store, self.log, self.ranges, self.devices, self.leases, self.details, self.clock, data / BACKUPS)

    def http(self, host: str, port: int) -> ThreadingHTTPServer:
        server = ThreadingHTTPServer((host, port), TeamRequestHandler)
        server.daemon_threads = True
        server.team = self
        return server

    def started(self, host: str, port: int) -> ThreadingHTTPServer:
        server = self.http(host, port)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        return server

    def close(self, server: ThreadingHTTPServer) -> None:
        self.log.close()
        server.shutdown()
        server.server_close()
        self.store.close()
