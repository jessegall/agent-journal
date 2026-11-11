from engine.database.database import Database
from engine.database.seed_tables import SeedTables
from engine.errors.missing_seed_error import MissingSeedError

MOST_IDS = 1000


class SeedFacts:
    """What a seed reads while it writes a row: the time of the seed, the environment its rows go to, and the
    ids of the seeded rows of a table, which are the rows numbered zero and below, so a row points at rows
    seeded before it. It reads at most a thousand ids of a table, the newest first."""

    def __init__(self, database: Database, timestamp: str, environment_id: int | None) -> None:
        self.tables, self.timestamp, self.environment_id = SeedTables(database), timestamp, environment_id
        self.ids: dict[str, tuple[int, ...]] = {}

    def table_ids(self, table: str) -> tuple[int, ...]:
        if table not in self.ids:
            self.ids[table] = self.tables.seeded_ids(table, MOST_IDS)
        if not self.ids[table]:
            raise MissingSeedError(table)
        return self.ids[table]

    def row_id(self, table: str, index: int) -> int:
        row_ids = self.table_ids(table)
        return row_ids[index % len(row_ids)]

    def reset(self, table: str) -> None:
        self.ids.pop(table, None)
