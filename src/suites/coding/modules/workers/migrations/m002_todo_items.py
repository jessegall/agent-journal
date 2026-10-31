from core.base.database.migration import Migration


class TodoItemsTableMigration(Migration):
    """Creates the todo_items table, one row per item of an agent program's to-do list."""

    number = 2
    statements = (
        "CREATE TABLE todo_items (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, position INTEGER NOT NULL, text TEXT NOT NULL,"
        " state TEXT NOT NULL DEFAULT 'pending', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX todo_items_agent ON todo_items (agent_id, position)",
    )
