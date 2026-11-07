from core.base.database.migration import Migration


class ShareApprovalIndexMigration(Migration):
    number = 5
    statements = ["CREATE INDEX share_links_state ON share_links(state)"]
