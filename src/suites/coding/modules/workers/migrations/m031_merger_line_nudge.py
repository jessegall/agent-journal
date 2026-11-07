from core.base.database.migration import Migration


class MergerLineNudgeMigration(Migration):
    number = 31
    statements = ["ALTER TABLE merger_lines ADD COLUMN nudge_json TEXT"]
