from core.base.database.migration import Migration


class HelperGrantsMigration(Migration):
    """Keeps what each helper may run: the program, its subcommands and its arguments."""

    number = 8
    statements = (
        "CREATE TABLE helper_grants (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " helper_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, program TEXT NOT NULL, subcommands TEXT NOT NULL, arguments TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX helper_grants_helper_program ON helper_grants (helper_id, program)",
    )
