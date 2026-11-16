from engine.database.migration import Migration


class SavedApprovalsMigration(Migration):
    """A user's yes kept for later requests is a saved approval: its table, its index, the approval's column
    that names one and the marks and dock items that show one take that name; the sync writes the table's
    rules again."""

    number = 8
    statements = [
        "DROP TRIGGER IF EXISTS standing_approvals_rule_scope_insert",
        "DROP TRIGGER IF EXISTS standing_approvals_rule_scope_update",
        "DROP INDEX IF EXISTS standing_approvals_kind",
        "ALTER TABLE standing_approvals RENAME TO saved_approvals",
        "ALTER TABLE saved_approvals RENAME COLUMN kind TO category",
        "CREATE INDEX saved_approvals_category ON saved_approvals(environment_id, category)",
        "ALTER TABLE approvals RENAME COLUMN standing_id TO saved_approval_id",
        "UPDATE chat_marks SET type = 'approvals.saved' WHERE type = 'approvals.standing'",
        "UPDATE chat_marks SET variant = 'accepted-by-saved-yes' WHERE variant = 'accepted-by-standing-yes'",
        "UPDATE chat_marks SET target_model = 'saved_approval' WHERE target_model = 'standing_approval'",
        "UPDATE dock_items SET type = 'approvals.saved-used' WHERE type = 'approvals.standing-used'",
        "UPDATE dock_items SET target_model = 'saved_approval' WHERE target_model = 'standing_approval'",
    ]
