from engine.database.migration import Migration


class ShareCommentIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 3
    statements = [
        'CREATE INDEX share_comments_link ON share_comments (share_link_id)',
    ]
