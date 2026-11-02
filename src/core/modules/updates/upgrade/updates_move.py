from core.base.database.database import Database
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource


class UpdatesMove(VersionFourMove):
    """Version 4's release messages were written for version 4's releases; they are dropped and stay in the
    backup."""

    name = "updates"
    drops = ["release_messages"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        return MoveReport()
