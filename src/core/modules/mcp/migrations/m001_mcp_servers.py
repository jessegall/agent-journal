from core.base.database.migration import Migration


class McpServersTableMigration(Migration):
    """Creates the MCP servers table, one row a server by its name, with no key in it."""

    number = 1
    statements = (
        "CREATE TABLE mcp_servers (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL UNIQUE,"
        " title TEXT NOT NULL, transport TEXT NOT NULL, command TEXT NOT NULL DEFAULT '', args TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(args)),"
        " url TEXT NOT NULL DEFAULT '', key_variable TEXT NOT NULL DEFAULT '', auth TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
