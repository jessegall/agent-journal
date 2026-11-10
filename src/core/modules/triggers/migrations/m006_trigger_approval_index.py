from engine.database.migration import Migration


class TriggerApprovalIndexMigration(Migration):
    number = 6
    statements = ["CREATE INDEX triggers_needs_enabling ON triggers(needs_enabling)"]
