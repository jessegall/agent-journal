from collections.abc import Callable, Mapping

from engine.database.database import Database
from engine.database.id_column_set import IdColumnSet
from engine.database.id_columns import AGENT_MODEL_NAMES
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.statement import Statement
from engine.errors.refusal import Refusal

ID_TABLES = ("actors", "agents")
MAP_TABLE = "id_rewrite_map"
CREATE_MAP = Statement(f"CREATE TEMP TABLE {MAP_TABLE} (old_id INTEGER PRIMARY KEY, new_id INTEGER NOT NULL UNIQUE, passing_id INTEGER NOT NULL UNIQUE)")
DROP_MAP = Statement(f"DROP TABLE IF EXISTS temp.{MAP_TABLE}")
FILL_MAP = f"INSERT INTO {MAP_TABLE} (old_id, new_id, passing_id) VALUES (?, ?, ?)"
TAKEN_IDS = (f"SELECT id FROM \"{{table}}\" WHERE id IN (SELECT new_id FROM {MAP_TABLE}) AND id NOT IN (SELECT old_id FROM {MAP_TABLE})")


class IdRewrite:
    """Gives actors and agents, which share one id space, new ids from one map of old id to new id: the two
    primary keys, agents.actor_id and every column and model and id pair that holds such an id are rewritten
    in two passes through negative passing ids, so an old id that is another's new id never mixes rows. It
    refuses before any change when a new id belongs to a row outside the map, runs in the caller's write
    with the foreign keys off, and gives the rows it rewrote per table."""

    def __init__(self, database: Database, json_rewrite: Callable[[str], int] | None = None) -> None:
        self.database, self.json_rewrite = database, json_rewrite

    def rewritten(self, mapping: Mapping[int, int], columns: IdColumnSet) -> dict[str, int]:
        if not mapping:
            return {}
        self.database.update(DROP_MAP)
        self.database.update(CREATE_MAP)
        try:
            for index, (old_id, new_id) in enumerate(sorted(mapping.items())):
                self.database.update(Statement(FILL_MAP, [old_id, new_id, -(index + 1)]))
            self.refuse_taken()
            plain = (*((table, "id") for table in ID_TABLES), ("agents", "actor_id"), *columns.plain)
            self.moved(plain, columns.pairs, "old_id", "passing_id")
            counts = self.moved(plain, columns.pairs, "passing_id", "new_id")
            if self.json_rewrite is not None:
                counts["json"] = self.json_rewrite(MAP_TABLE)
            return {table: count for table, count in counts.items() if count}
        finally:
            self.database.update(DROP_MAP)

    def refuse_taken(self) -> None:
        for table in ID_TABLES:
            taken = self.database.rows(Statement(TAKEN_IDS.format(table=table), scan_reason=SCHEMA_REASON))
            if taken:
                raise Refusal(f"{table} id {taken[0]['id']} is taken by a row the map does not move", "move that row in the same map or choose another id")

    def moved(self, plain: tuple[tuple[str, str], ...], pairs: tuple[tuple[str, str, str], ...], source: str, target: str) -> dict[str, int]:
        counts: dict[str, int] = {}
        for table, column in dict.fromkeys(plain):
            counts[table] = counts.get(table, 0) + self.database.update(Statement(
                f'UPDATE "{table}" SET "{column}" = (SELECT {target} FROM {MAP_TABLE} WHERE {source} = "{table}"."{column}")'
                f' WHERE "{column}" IN (SELECT {source} FROM {MAP_TABLE})'))
        models = ", ".join(f"'{model}'" for model in AGENT_MODEL_NAMES)
        for table, model_column, id_column in pairs:
            counts[table] = counts.get(table, 0) + self.database.update(Statement(
                f'UPDATE "{table}" SET "{id_column}" = (SELECT {target} FROM {MAP_TABLE} WHERE {source} = "{table}"."{id_column}")'
                f' WHERE "{model_column}" IN ({models}) AND "{id_column}" IN (SELECT {source} FROM {MAP_TABLE})'))
        return counts
