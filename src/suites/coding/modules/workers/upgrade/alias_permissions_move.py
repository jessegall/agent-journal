from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource


class AliasPermissionsMove(VersionFourMove):
    """Carries worker permissions after core has moved the aliases themselves."""

    name = "alias-permissions"
    references = ["aliases"]
    id_modules = ["journal.core.aliases"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, rows = MoveReport(), RowInsert(target)
        for alias in source.rows("aliases"):
            alias_id = map.new_id("aliases", alias["id"])
            if alias_id is None:
                continue
            rows.set_value("aliases", alias_id, "agent_access", int(bool(alias["worker_access"])))
            report.count("alias permissions", True)
        return report
