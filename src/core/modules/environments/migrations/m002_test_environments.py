from engine.database.migration import Migration


class TestEnvironmentsMigration(Migration):
    """An environment can be marked as a test one, and a user can grant one agent from another environment the
    right to work in it."""

    number = 2
    statements = ["ALTER TABLE environments ADD COLUMN test INTEGER NOT NULL DEFAULT 0 CHECK (test IN (0, 1))",
                  "ALTER TABLE environments ADD COLUMN test_agent_id INTEGER REFERENCES actors(id) ON DELETE SET NULL"]
