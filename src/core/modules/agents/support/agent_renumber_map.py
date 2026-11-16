from engine.database.database import Database
from engine.database.id_columns import IdColumns
from engine.database.id_rewrite import IdRewrite
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.database.stored_json_ids import StoredJsonIds

STAYING_AGENTS = Statement("SELECT id, role FROM agents ORDER BY id", scan_reason=SCHEMA_REASON)
RECORD_RENUMBER = "INSERT INTO agent_renumbers (old_id, new_id, role) VALUES (?, ?, ?)"
MAIN_NUMBER_SET = "UPDATE agents SET number = 1 WHERE id = 1"


class AgentRenumberMap:
    """Gives the agents that stay the ids 1, 2, 3 and up, the project's main agent 1 and every other one in the
    order of its old id, with its actor's id the same, through one map the id rewrite tool applies to every row,
    pair and stored stack that names an agent or its actor; the map is kept in agent_renumbers for the folder
    renames and the notices that follow. launch_agent_id is an agent column the tool reaches by its name."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def mapping(self, main_agent_id: int) -> dict[int, int]:
        others = [int(row["id"]) for row in self.database.rows(STAYING_AGENTS) if int(row["id"]) != main_agent_id]
        return {old_id: new_id for new_id, old_id in enumerate([main_agent_id, *others], start=1)}

    def renumbered(self, main_agent_id: int) -> dict[str, int]:
        roles = {int(row["id"]): str(row["role"]) for row in self.database.rows(STAYING_AGENTS)}
        mapping = {old_id: new_id for old_id, new_id in self.mapping(main_agent_id).items() if old_id != new_id}
        counts = IdRewrite(self.database, StoredJsonIds(self.database).rewritten).rewritten(mapping, IdColumns.found(SchemaColumns(self.database).columns()))
        for old_id, new_id in mapping.items():
            self.database.update(Statement(RECORD_RENUMBER, [old_id, new_id, roles[old_id]]))
        self.database.update(Statement(MAIN_NUMBER_SET))
        return counts
