from engine.database.migration import Migration


class MessageLinkPathsMigration(Migration):
    """Indexes message links in both directions for conversation reads."""

    number = 8
    statements = [
        "CREATE INDEX links_message_source ON links (source_model, source_id, target_model, link_type, target_id)",
        "CREATE INDEX links_message_target ON links (target_model, target_id, source_model, link_type, source_id)",
    ]
