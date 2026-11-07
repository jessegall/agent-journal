from core.base.database.migration import Migration


class PersonPresetsMigration(Migration):
    """Creates the table of the layouts each person saved as a preset, per environment and page."""

    number = 2
    statements = (
        "CREATE TABLE person_presets (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " page TEXT NOT NULL, name TEXT NOT NULL CHECK (name <> ''), shape TEXT NOT NULL CHECK (json_valid(shape)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX person_presets_person_page ON person_presets (environment_id, person_id, page)",
    )
