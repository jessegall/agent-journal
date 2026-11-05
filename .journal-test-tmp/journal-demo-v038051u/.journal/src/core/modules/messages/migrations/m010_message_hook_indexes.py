from core.base.database.migration import Migration


class MessageHookIndexesMigration(Migration):
    """The messages the rules of every hook look for are found through indexes: those not yet read, an agent's
    own, those sent to an agent, and those made after a time, so a hook costs the same however many messages
    the chat holds."""

    number = 10
    statements = (
        "CREATE INDEX messages_waiting ON messages (environment_id, id) WHERE read_at IS NULL",
        "CREATE INDEX messages_creator ON messages (creator_id, type, id)",
        "CREATE INDEX messages_agent ON messages (agent_id, type, id)",
        "CREATE INDEX messages_created ON messages (environment_id, created_at)",
    )
