from engine.actor.actor import FIRST_OTHER_ACTOR_ID
from engine.database.database import Database
from engine.database.id_columns import IdColumns
from engine.database.id_rewrite import IdRewrite
from engine.database.rebuild_migration import RebuildMigration
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.database.stored_json_ids import StoredJsonIds

LOW_OTHER_ACTORS = Statement("SELECT id FROM actors WHERE type NOT IN ('agent', 'core') AND id < ? ORDER BY id", [FIRST_OTHER_ACTOR_ID], scan_reason=SCHEMA_REASON)
HIGHEST_ACTOR = Statement("SELECT max(id) AS id FROM actors", scan_reason=SCHEMA_REASON)


class OtherActorsHighMigration(RebuildMigration):
    """Moves every actor that is neither an agent nor the core, users and modules among them, to ids from
    FIRST_OTHER_ACTOR_ID in the order they were made, with every row, pair and stored stack that names it,
    so the low ids are the agents' own; an actor already there stays."""

    number = 6
    statements = ()

    def rebuild(self, database: Database) -> None:
        low = [int(row["id"]) for row in database.rows(LOW_OTHER_ACTORS)]
        if not low:
            return
        first = max(FIRST_OTHER_ACTOR_ID, int(database.rows(HIGHEST_ACTOR)[0]["id"]) + 1)
        mapping = {old_id: first + index for index, old_id in enumerate(low)}
        IdRewrite(database, StoredJsonIds(database).rewritten).rewritten(mapping, IdColumns.found(SchemaColumns(database).columns()))
