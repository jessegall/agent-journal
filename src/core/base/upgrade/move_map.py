from collections.abc import Callable

from core.base.database.database import Database
from core.base.database.upgrade_map_table import UpgradeMapTable


class MoveMap:
    """Every row moved from version 4: its version 4 table and id and its version 5 table and id, so a second run
    skips what is moved and a move finds the new id of a row it refers to."""

    def __init__(self, database: Database) -> None:
        self.table = UpgradeMapTable(database)

    def new_id(self, old_table: str, old_id: int) -> int | None:
        return self.table.new_id(old_table, old_id)

    def record(self, old_table: str, old_id: int, new_table: str, new_id: int) -> None:
        self.table.record(old_table, old_id, new_table, new_id)

    def transfer(self, old_table: str, old_id: int, new_table: str, insert: Callable[[], int]) -> bool:
        if self.new_id(old_table, old_id) is not None:
            return False
        self.record(old_table, old_id, new_table, insert())
        return True

    def count(self) -> int:
        return self.table.count()

    def finish(self, module: str, move: str, counts: dict[str, dict[str, int]]) -> None:
        self.table.finish(module, move, counts)

    def finished(self, module: str, move: str) -> dict[str, dict[str, int]] | None:
        return self.table.finished(module, move)
