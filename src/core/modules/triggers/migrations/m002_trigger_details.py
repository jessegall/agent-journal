from core.base.database.migration import Migration


class TriggerDetailsMigration(Migration):
    """Gives a trigger a name and a description, where to look and how to match, its conditions, its extra
    actions and a pause; a trigger from before takes its text as its name and goes on as it did."""

    number = 2
    statements = (
        "ALTER TABLE triggers ADD COLUMN name TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE triggers ADD COLUMN description TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE triggers ADD COLUMN watch_places TEXT NOT NULL DEFAULT '[\"messages\", \"commands\", \"files\"]' CHECK (json_valid(watch_places))",
        "ALTER TABLE triggers ADD COLUMN match_mode TEXT NOT NULL DEFAULT 'part'",
        "ALTER TABLE triggers ADD COLUMN conditions TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(conditions))",
        "ALTER TABLE triggers ADD COLUMN extra_actions TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(extra_actions))",
        "ALTER TABLE triggers ADD COLUMN paused_at TEXT",
        "UPDATE triggers SET name = substr(text, 1, 60)",
    )
