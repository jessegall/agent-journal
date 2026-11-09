from core.base.database.migration import Migration


class MessageHookScanIndexesMigration(Migration):
    """Indexes the two reads every hook makes of person messages by what they ask for, so none of them walks the
    chat: those not yet read nor delivered, and those read after a time."""

    number = 21
    statements = [
        "CREATE INDEX messages_pending ON messages (environment_id, type, id) WHERE read_at IS NULL AND delivered_at IS NULL",
        "CREATE INDEX messages_type_read ON messages (environment_id, type, read_at)",
    ]
