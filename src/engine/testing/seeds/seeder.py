from collections.abc import Generator
from contextlib import contextmanager

from engine.database.database import Database
from engine.database.seed_tables import ID_COLUMN, SeedTables
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts

TIME_COLUMNS = ("created_at", "updated_at")


class Seeder:
    """Fills tables with the rows of seeds, many at a time and without the commands that make such rows one by
    one. Seeded rows are numbered downwards from zero, below every row a story makes, so a story's own rows
    keep the numbers they would have with no seed: the database numbers a new row one above the highest id of
    its table. While seeds are filled in, in one change of the database, the rules of the tables on states and
    types are dropped, so a seed writes a finished row as it stands; they are put back at the end."""

    def __init__(self, database: Database, timestamp: str, environment_id: int | None) -> None:
        self.database, self.timestamp = database, timestamp
        self.tables = SeedTables(database)
        self.facts = SeedFacts(database, timestamp, environment_id)

    def seed(self, seed: Seed, count: int, **fixed: object) -> tuple[int, ...]:
        names = self.tables.column_names(seed.table)
        first_id = min(self.tables.lowest_id(seed.table), 1) - 1
        timestamps = {column: self.timestamp for column in TIME_COLUMNS if column in names}
        rows = [{ID_COLUMN: first_id - index, **timestamps, **seed.columns(index, self.facts), **fixed} for index in range(count)]
        if rows:
            columns = tuple(rows[0])
            self.tables.insert_rows(seed.table, columns, [tuple(row[column] for column in columns) for row in rows])
        self.facts.reset(seed.table)
        return tuple(row[ID_COLUMN] for row in rows)

    @contextmanager
    def filling(self) -> Generator[None]:
        if self.database.has_transaction:
            with self.disabled_rules():
                yield
            return
        with self.database.transaction(), self.disabled_rules():
            yield

    @contextmanager
    def disabled_rules(self) -> Generator[None]:
        rules = self.tables.rules()
        for name, _ in rules:
            self.tables.drop_rule(name)
        try:
            yield
        finally:
            for _, statement in rules:
                self.tables.restore_rule(statement)
