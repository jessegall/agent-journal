from engine.actor.actor import FIRST_OTHER_ACTOR_ID
from engine.database.database import Database
from engine.database.id_columns import IdColumns
from engine.database.id_rewrite import IdRewrite
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.database.stored_json_ids import StoredJsonIds

AGENTLESS_ACTORS = Statement("SELECT id FROM actors WHERE type = 'agent' AND id BETWEEN 1 AND ? AND id NOT IN (SELECT id FROM agents) ORDER BY id",
                             [FIRST_OTHER_ACTOR_ID - 1], scan_reason=SCHEMA_REASON)
HIGHEST_ACTOR = Statement("SELECT max(id) AS id FROM actors", scan_reason=SCHEMA_REASON)


class RemovedAgentActors:
    """Moves the actor row of every agent that was removed, which stays because what it wrote names it, out of
    the agents' ids to the upper range, in old-id order, with every row, pair and stored stack that names it;
    the actors of staying agents keep their ids."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def moved(self) -> dict[str, int]:
        agentless = [int(row["id"]) for row in self.database.rows(AGENTLESS_ACTORS)]
        if not agentless:
            return {}
        first = max(FIRST_OTHER_ACTOR_ID, int(self.database.rows(HIGHEST_ACTOR)[0]["id"]) + 1)
        mapping = {old_id: first + index for index, old_id in enumerate(agentless)}
        return IdRewrite(self.database, StoredJsonIds(self.database).rewritten).rewritten(mapping, IdColumns.found(SchemaColumns(self.database).columns()))
