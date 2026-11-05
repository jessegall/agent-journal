from core.base.database.migration import Migration


class ProcessSandboxMigration(Migration):
    number = 45
    statements = ["ALTER TABLE processes ADD COLUMN sandbox_level TEXT NOT NULL DEFAULT 'none'"]
