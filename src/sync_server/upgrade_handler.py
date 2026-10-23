import time
from pathlib import Path

from sync_server.change_log import ChangeLog
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.id_ranges import IdRanges
from sync_server.leases import UPGRADE_LEASE, Leases
from sync_server.logged_change import CREATED, LoggedChange
from sync_server.refusal import Refusal
from sync_server.server_clock import ServerClock
from sync_server.team_details import TeamDetails
from sync_server.upgrade_request import UpgradeRequest
from sync_server.upload_answer import UploadAnswer
from sync_server.upload_handler import UPLOAD_ACTOR


class UpgradeHandler:
    """Takes a journal's migrated copy in place of the team's rows: only from the device holding the upgrade lease, only when the log has not moved past the sequence that journal pulled to, and only after a backup of the database is written into the backups folder. The copy's rows become creations in the log, the team's migration is the copy's, and the lowest sequence a pull may go on from rises to the new head, so every other device takes the full copy."""

    def __init__(self, store: Store, log: ChangeLog, ranges: IdRanges, devices: Devices, leases: Leases, details: TeamDetails, clock: ServerClock, backups: Path) -> None:
        self.store, self.log, self.ranges, self.devices, self.leases = store, log, ranges, devices, leases
        self.details, self.clock, self.backups = details, clock, backups

    def answer(self, token: str, request: UpgradeRequest) -> UploadAnswer:
        device, person = self.devices.device(token), self.devices.person(token)
        lease = self.leases.state(UPGRADE_LEASE, self.clock.time())
        if lease.device_id != device.id or lease.is_lapsed:
            raise Refusal("only the device holding the team's upgrade lease uploads a migrated copy: take it first")
        self.require_head(request.base_sequence)
        self.backups.mkdir(parents=True, exist_ok=True)
        self.store.backup(self.backups / time.strftime("team-before-upgrade-%Y%m%d-%H%M%S.db"))
        with self.store.transaction():
            self.require_head(request.base_sequence)
            self.log.cleared()
            for row in request.rows:
                self.log.appended(LoggedChange(row.row_table, row.row, CREATED, UPLOAD_ACTOR, person.id, device.id, row.fields, row.changed_at))
            for table, number in request.highest.items():
                self.ranges.raise_floor(table, int(number))
            self.details.record_migration(request.migration)
            self.details.record_lowest_sequence(self.log.head())
            return UploadAnswer(len(request.rows), self.log.head())

    def require_head(self, base_sequence: int) -> None:
        if self.log.head() != base_sequence:
            raise Refusal(f"the team's journal moved on to {self.log.head()} since this journal pulled to {base_sequence}: pull, migrate and upload again")
