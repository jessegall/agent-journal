from engine.database.migration import Migration


class UnreadKeptNewestMigration(Migration):
    """Marks read every person message an agent has not read beyond the newest 25 it holds, so a backlog such as
    an upgrade's thousands of version 4 messages never reaches an agent."""

    number = 24
    statements = [
        "UPDATE messages SET read_at = strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now') WHERE id IN ("
        "SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY environment_id, target_agent_id ORDER BY id DESC) AS place"
        " FROM messages WHERE read_at IS NULL AND type IN ('user', 'comment')) WHERE place > 25)",
    ]
