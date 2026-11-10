from engine.database.migration import Migration


class PluginConfigMigration(Migration):
    number = 7
    statements = ["ALTER TABLE plugins ADD COLUMN config_version INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE plugins ADD COLUMN config_digest TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE plugins ADD COLUMN config_document TEXT NOT NULL DEFAULT 'null'",
                  "ALTER TABLE plugins ADD COLUMN config_pointers TEXT NOT NULL DEFAULT '[]'"]
