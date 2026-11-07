from core.base.database.migration import Migration
from core.modules.documents.migrations.m001_documents import ROW_COLUMNS


class LinkCorrectionsMigration(Migration):
    """Retains the exact attribution identities removed through correction."""

    number = 7
    statements = [
        "CREATE TABLE links_with_stable_ids (id INTEGER PRIMARY KEY AUTOINCREMENT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, source_model TEXT NOT NULL,"
        " source_id INTEGER NOT NULL, target_model TEXT NOT NULL, target_id INTEGER NOT NULL, link_type TEXT NOT NULL,"
        f" {ROW_COLUMNS}, UNIQUE (source_model, source_id, target_model, target_id, link_type)) STRICT",
        "INSERT INTO links_with_stable_ids (id, creator_id, source_model, source_id, target_model, target_id, link_type,"
        " version, metadata, created_at, updated_at) SELECT id, creator_id, source_model, source_id, target_model,"
        " target_id, link_type, version, metadata, created_at, updated_at FROM links",
        "DROP TABLE links",
        "ALTER TABLE links_with_stable_ids RENAME TO links",
        "CREATE INDEX links_target ON links (target_model, target_id, link_type)",
        "CREATE INDEX links_source ON links (source_model, source_id, id)",
        "CREATE TABLE link_corrections (id INTEGER PRIMARY KEY, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " link_id INTEGER NOT NULL, link_creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " source_model TEXT NOT NULL, source_id INTEGER NOT NULL, target_model TEXT NOT NULL, target_id INTEGER NOT NULL,"
        " link_type TEXT NOT NULL, UNIQUE (environment_id, source_model, source_id, target_model, target_id, link_type)) STRICT",
        "CREATE INDEX link_corrections_removed_link ON link_corrections (environment_id, link_id)",
    ]
