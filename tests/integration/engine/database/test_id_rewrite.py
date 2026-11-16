import json

import pytest

from engine.database.database import Database
from engine.database.id_columns import IdColumns
from engine.database.id_rewrite import IdRewrite
from engine.database.reference_rewrite import ReferenceRewrite
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.database.stored_json_ids import StoredJsonIds
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome

TABLES = (
    "CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT NOT NULL)",
    "CREATE TABLE agents (id INTEGER PRIMARY KEY REFERENCES actors(id), actor_id INTEGER NOT NULL UNIQUE REFERENCES actors(id),"
    " parent_id INTEGER REFERENCES agents(id))",
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY, holder_id INTEGER REFERENCES actors(id))",
    "CREATE TABLE events (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL)",
    "CREATE TABLE links (id INTEGER PRIMARY KEY, target_model TEXT NOT NULL, target_id INTEGER NOT NULL)",
    "CREATE TABLE agent_stacks (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL UNIQUE REFERENCES agents(id))",
    "INSERT INTO actors VALUES (1, 'core'), (2, 'first'), (3, 'second'), (9, 'person')",
    "INSERT INTO agents VALUES (2, 2, NULL), (3, 3, 2)",
    "INSERT INTO tasks VALUES (1, 2), (2, 3), (3, 9)",
    "INSERT INTO events VALUES (1, 2), (2, 3)",
    "INSERT INTO links VALUES (1, 'agent', 2), (2, 'task', 2), (3, 'actor', 3)",
    "INSERT INTO agent_stacks VALUES (1, 2), (2, 3)",
)


def database(tmp_path) -> Database:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir(parents=True)
    opened = Database.opened(home)
    for sql in TABLES:
        opened.update(Statement(sql))
    return opened


def rewritten(opened: Database, mapping: dict[int, int]) -> dict[str, int]:
    with ReferenceRewrite(opened).without_foreign_keys():
        return IdRewrite(opened).rewritten(mapping, IdColumns.found(SchemaColumns(opened).columns()))


def rows(opened: Database, sql: str) -> list[tuple[object, ...]]:
    return [tuple(row) for row in opened.rows(Statement(sql, scan_reason="a test reads its own small tables"))]


def test_a_swap_of_two_agents_keeps_every_row_with_its_own_references(tmp_path):
    opened = database(tmp_path)
    counts = rewritten(opened, {2: 3, 3: 2})
    assert rows(opened, "SELECT id, actor_id, parent_id FROM agents ORDER BY id") == [(2, 2, 3), (3, 3, None)]
    assert rows(opened, "SELECT id, holder_id FROM tasks ORDER BY id") == [(1, 3), (2, 2), (3, 9)]
    assert rows(opened, "SELECT id, actor_id FROM events ORDER BY id") == [(1, 3), (2, 2)]
    assert rows(opened, "SELECT id, target_id FROM links ORDER BY id") == [(1, 3), (2, 2), (3, 2)]
    assert rows(opened, "SELECT id, session_agent_id FROM agent_stacks ORDER BY id") == [(1, 3), (2, 2)]
    assert counts["tasks"] == 2 and counts["agents"] == 5


def test_a_new_id_held_by_a_row_outside_the_map_is_refused_naming_the_table(tmp_path):
    opened = database(tmp_path)
    with pytest.raises(Refusal, match="actors id 9"):
        rewritten(opened, {2: 9})
    assert rows(opened, "SELECT id FROM agents ORDER BY id") == [(2,), (3,)]


def test_an_empty_map_changes_nothing(tmp_path):
    opened = database(tmp_path)
    assert rewritten(opened, {}) == {}
    assert rows(opened, "SELECT id, holder_id FROM tasks ORDER BY id") == [(1, 2), (2, 3), (3, 9)]


def test_a_stack_keeps_its_row_references_and_agent_work_with_the_ids_and_an_event_keeps_what_it_said(tmp_path):
    opened = database(tmp_path)
    stack = [{"state_name": "Working", "state": {"work": {"work_type": "unit", "work_id": 3, "text": "unit"}},
              "state_key": {"subject": {"model": "agent", "row_id": 3}, "generation": "bottom"}},
             {"state_name": "Blocked", "state_key": {"subject": {"model": "task", "row_id": 3}}}]
    opened.update(Statement("DROP TABLE agent_stacks"))
    opened.update(Statement("CREATE TABLE agent_stacks (id INTEGER PRIMARY KEY, stacked_states TEXT NOT NULL)"))
    opened.update(Statement("INSERT INTO agent_stacks VALUES (1, ?)", [json.dumps(stack)]))
    opened.update(Statement("CREATE TABLE event_log (id INTEGER PRIMARY KEY, data TEXT NOT NULL)"))
    opened.update(Statement("INSERT INTO event_log VALUES (1, ?)", [json.dumps({"agent_id": 3})]))
    with ReferenceRewrite(opened).without_foreign_keys():
        counts = IdRewrite(opened, StoredJsonIds(opened).rewritten).rewritten({3: 4}, IdColumns.found(SchemaColumns(opened).columns()))
    moved = json.loads(rows(opened, "SELECT stacked_states FROM agent_stacks")[0][0])
    assert (moved[0]["state"]["work"]["work_id"], moved[0]["state_key"]["subject"]["row_id"], moved[1]["state_key"]["subject"]["row_id"]) == (4, 4, 3)
    assert rows(opened, "SELECT data FROM event_log") == [(json.dumps({"agent_id": 3}),)] and counts["json"] == 1
