from engine.database.migration import Migration


class MergerLineMessageMigration(Migration):
    number = 36
    statements = ["ALTER TABLE merger_lines ADD COLUMN nudge_json TEXT"]
