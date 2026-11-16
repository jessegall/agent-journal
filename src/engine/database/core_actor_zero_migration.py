from engine.actor.actor import CORE_ACTOR_ID
from engine.database.database import Database
from engine.database.id_columns import IdColumns
from engine.database.id_rewrite import IdRewrite
from engine.database.rebuild_migration import RebuildMigration
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.database.stored_json_ids import StoredJsonIds
from engine.errors.refusal import Refusal

FORMER_CORE_ACTOR_ID = 1
FORMER_CORE_ROW = Statement("SELECT type FROM actors WHERE id = ?", [FORMER_CORE_ACTOR_ID], scan_reason=SCHEMA_REASON)


class CoreActorZeroMigration(RebuildMigration):
    """Moves the journal core's own actor from id 1 to id 0, with every row, pair and stored stack that names
    it, so agent ids may count 1, 2, 3; a journal whose actor 1 is no longer the core is left as it is, and one
    whose actor 1 is something else than the core is refused."""

    number = 5
    statements = ()

    def rebuild(self, database: Database) -> None:
        former = database.rows(FORMER_CORE_ROW)
        if not former:
            return
        if former[0]["type"] != "core":
            raise Refusal(f"actor {FORMER_CORE_ACTOR_ID} is a {former[0]['type']}, not the core", "move it out of id 1 before the core moves to 0")
        IdRewrite(database, StoredJsonIds(database).rewritten).rewritten({FORMER_CORE_ACTOR_ID: CORE_ACTOR_ID}, IdColumns.found(SchemaColumns(database).columns()))
