from engine.database.migration import Migration


class EnabledRuleIndexMigration(Migration):
    """Indexes the rules by whether they are on, so the retry that looks across every environment finds the rules
    that are on without reading every rule."""

    number = 4
    statements = ["CREATE INDEX assign_rules_enabled ON assign_rules (enabled, environment_id)"]
