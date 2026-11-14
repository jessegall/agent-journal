from engine.database.statement import Statement
from suites.coding.migrations.m009_prune_file_edits import PruneFileEditsMigration

INSERT_EDIT = ("INSERT INTO file_edits (environment_id, session_agent_id, creator_id, path, added, removed, created_at, updated_at)"
               " VALUES (1, ?, ?, ?, 1, 0, '2026-11-14T12:00:00+00:00', '2026-11-14T12:00:00+00:00')")


def test_the_migration_removes_edits_under_graphify_out_and_dist_and_keeps_the_others(journal):
    agent_id = journal.new_row_id("agent start s-1 claude main --environment main")
    for path in ("graphify-out/graph.json", "web/dist/app.js", "src/cart.py"):
        journal.database.update(Statement(INSERT_EDIT, [agent_id, agent_id, path]))
    for statement in PruneFileEditsMigration.statements:
        journal.database.update(Statement(statement))
    assert [row["path"] for row in journal.database.rows(Statement("SELECT path FROM file_edits"))] == ["src/cart.py"]
