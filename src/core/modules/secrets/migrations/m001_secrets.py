from core.base.database.migration import Migration


class SecretsTableMigration(Migration):
    """Creates the secrets table, which holds a secret's fields and programs and never its values."""

    number = 1
    statements = (
        "CREATE TABLE secrets (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200), brief TEXT NOT NULL DEFAULT '', secret_type TEXT NOT NULL,"
        " fields TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(fields)), filled TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(filled)),"
        " programs TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(programs)), proposed TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(proposed)),"
        " helpers INTEGER NOT NULL DEFAULT 0, deleted_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
