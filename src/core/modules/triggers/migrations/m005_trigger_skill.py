from core.base.database.migration import Migration


class TriggerSkillMigration(Migration):
    """Lets a phrase trigger require a skill."""

    number = 5
    statements = ["ALTER TABLE triggers ADD COLUMN skill TEXT"]
