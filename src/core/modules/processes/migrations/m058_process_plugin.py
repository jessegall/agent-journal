from engine.database.migration import Migration


class ProcessPluginMigration(Migration):
    number = 58
    statements = ["ALTER TABLE processes ADD COLUMN plugin TEXT NOT NULL DEFAULT ''"]
