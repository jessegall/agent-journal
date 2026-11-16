from engine.actor.actor import FIRST_OTHER_ACTOR_ID
from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.errors.refusal import Refusal
from core.modules.agents.support.column_rule import ColumnRule

AGENT_IDS = Statement("SELECT id FROM agents ORDER BY id", scan_reason=SCHEMA_REASON)
UNMATCHED_ACTORS = Statement("SELECT agents.id AS id FROM agents LEFT JOIN actors ON actors.id = agents.id"
                             " WHERE agents.actor_id != agents.id OR actors.id IS NULL OR actors.type != 'agent'", scan_reason=SCHEMA_REASON)
LOW_ACTORS = Statement("SELECT id FROM actors WHERE id BETWEEN 1 AND ? AND id NOT IN (SELECT id FROM agents)", [FIRST_OTHER_ACTOR_ID - 1], scan_reason=SCHEMA_REASON)
SAMPLE_TABLES = ("tasks", "messages", "documents", "reports")
SAMPLE_ROW = "SELECT {table}.id AS id, actors.name AS name, actors.type AS type FROM {table} JOIN actors ON actors.id = {table}.creator_id ORDER BY {table}.id DESC LIMIT 1"
SAMPLE_AGAIN = "SELECT actors.name AS name, actors.type AS type FROM {table} JOIN actors ON actors.id = {table}.creator_id WHERE {table}.id = ?"
TABLE_EXISTS = "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?"


class RenumberCheck:
    """Checks the renumber of agents before it is committed, and refuses, which rolls it all back, naming the
    table and the column: every table holds its rows before less the rows deleted, no key is broken, the
    database is intact, every agent column and agent pair names an existing agent, every agent has an actor of
    type agent with its own id, the agents are 1 to n, no actor but the agents' sits in their range, and the
    last task, message, document and report still name the same writer by name and type. The counts and the
    samples are taken after the fold of the main agents, which checks itself, since a fold gives a folded
    main's rows to the survivor."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.rewrite = ReferenceRewrite(database)

    def tables(self) -> list[str]:
        return sorted({column.table for column in SchemaColumns(self.database).columns()})

    def tables_counted(self) -> dict[str, int]:
        return self.rewrite.table_counts(self.tables())

    def samples(self) -> dict[str, tuple[int, str, str]]:
        found = {}
        for table in SAMPLE_TABLES:
            if not self.database.rows(Statement(TABLE_EXISTS, [table], scan_reason=SCHEMA_REASON)):
                continue
            rows = self.database.rows(Statement(SAMPLE_ROW.format(table=table), scan_reason=SCHEMA_REASON))
            if rows:
                found[table] = (int(rows[0]["id"]), str(rows[0]["name"]), str(rows[0]["type"]))
        return found

    def checked(self, counts_before: dict[str, int], deleted: dict[str, int], samples: dict[str, tuple[int, str, str]]) -> None:
        problems = [f"{table} has {count} rows, not {counts_before.get(table, 0) - deleted.get(table, 0)}"
                    for table, count in self.rewrite.table_counts(self.tables()).items() if count != counts_before.get(table, 0) - deleted.get(table, 0)]
        problems += [f"a broken key: {key}" for key in self.rewrite.broken_keys()[:5]]
        if not self.rewrite.is_intact():
            problems.append("the integrity check failed")
        agent_ids = [int(row["id"]) for row in self.database.rows(AGENT_IDS)]
        problems += self.unknown_agents(agent_ids)
        problems += [f"agent {row['id']} has no actor of type agent with its id" for row in self.database.rows(UNMATCHED_ACTORS)]
        if agent_ids != list(range(1, len(agent_ids) + 1)):
            problems.append(f"the agents are not 1 to {len(agent_ids)}")
        problems += [f"actor {row['id']} is not an agent and sits in the agents' ids" for row in self.database.rows(LOW_ACTORS)]
        problems += self.changed_samples(samples)
        if problems:
            raise Refusal(f"the renumber of agents does not add up, so nothing changed: {'; '.join(problems[:10])}", "send the system log to the journal's maker")

    def unknown_agents(self, agent_ids: list[int]) -> list[str]:
        sets = ColumnRule.sets(SchemaColumns(self.database).columns())
        known = ",".join(str(agent_id) for agent_id in agent_ids) or "NULL"
        problems = [f"{table}.{column} names an agent that does not exist" for table, column in sets.agent
                    if self.database.rows(Statement(f'SELECT 1 FROM "{table}" WHERE "{column}" IS NOT NULL AND "{column}" NOT IN ({known}) LIMIT 1', scan_reason=SCHEMA_REASON))]
        problems += [f"{table}.{row_id} names an agent that does not exist" for table, model, row_id in sets.pairs
                     if self.database.rows(Statement(f'SELECT 1 FROM "{table}" WHERE "{model}" IN (\'agent\', \'agents\') AND "{row_id}" NOT IN ({known}) LIMIT 1', scan_reason=SCHEMA_REASON))]
        return problems

    def changed_samples(self, samples: dict[str, tuple[int, str, str]]) -> list[str]:
        problems = []
        for table, (row_id, name, actor_type) in samples.items():
            rows = self.database.rows(Statement(SAMPLE_AGAIN.format(table=table), [row_id], scan_reason=SCHEMA_REASON))
            if rows and (str(rows[0]["name"]), str(rows[0]["type"])) != (name, actor_type):
                problems.append(f"{table} {row_id} was written by {name}, now by {rows[0]['name']}")
        return problems
