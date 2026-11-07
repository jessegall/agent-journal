from core.base.database.migration import Migration


class MergerLineNudgeMigration(Migration):
    number = 34
    statements = ["ALTER TABLE merger_lines ADD COLUMN nudge_json TEXT"]
