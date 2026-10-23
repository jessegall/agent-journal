from sync_server.change_log import ChangeLog
from sync_server.copied_row import CopiedRow
from sync_server.db.store import Store
from sync_server.devices import Devices
from sync_server.id_ranges import IdRanges
from sync_server.logged_change import CREATED, LoggedChange
from sync_server.refusal import Refusal
from sync_server.team_details import TeamDetails
from sync_server.upload_answer import UploadAnswer

UPLOAD_ACTOR = "system"


class UploadHandler:
    """Takes the first full copy of a journal that becomes the team's: every row as a creation in the log, the highest number each table had, so the blocks handed out start above it, and the first commit of its repository, which every journal that joins must share. Only an admin uploads, and only to a team whose log is empty."""

    def __init__(self, store: Store, log: ChangeLog, ranges: IdRanges, devices: Devices, details: TeamDetails) -> None:
        self.store, self.log, self.ranges, self.devices, self.details = store, log, ranges, devices, details

    def answer(self, token: str, rows: tuple[CopiedRow, ...], highest: dict, repository: str, version: str) -> UploadAnswer:
        admin, device = self.devices.admin(token), self.devices.device(token)
        with self.store.transaction():
            if self.log.head():
                raise Refusal("the team's journal already holds rows: a full copy is taken only by a team that has none")
            for row in rows:
                self.log.appended(LoggedChange(row.row_table, row.row, CREATED, UPLOAD_ACTOR, admin.id, device.id, row.fields, row.changed_at))
            for table, number in highest.items():
                self.ranges.raise_floor(table, int(number))
            self.details.record_repository(repository)
            self.details.record_version(version)
            return UploadAnswer(len(rows), self.log.head())
