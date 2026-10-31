from core.base.database.database import Database
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

PAIRING_NOTE = "version 4 phones and pairing codes stay in the backup: pair each phone again from the Phones window"


class PhoneMove(VersionFourMove):
    """Leaves version 4's phones and pairing codes in the backup, counted, and tells the person to pair each phone
    again, since a version 5 phone keeps only the digest of its own session token."""

    name = "phone"
    reads = ["phones", "phone_codes"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report = MoveReport()
        for table in self.reads:
            report.drop(table, len(source.rows(table)))
        if report.dropped["phones"]:
            report.note(PAIRING_NOTE)
        return report
