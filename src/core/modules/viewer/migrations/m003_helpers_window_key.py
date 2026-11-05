from core.base.database.migration import Migration


class HelpersWindowKeyMigration(Migration):
    """Moves saved layouts and window settings to the window's new key."""

    number = 3
    statements = ["UPDATE viewer_layouts SET layout = replace(layout, 'agents.subagents', 'agents.helpers') WHERE layout LIKE '%agents.subagents%'",
                  "UPDATE person_presets SET shape = replace(shape, 'agents.subagents', 'agents.helpers') WHERE shape LIKE '%agents.subagents%'",
                  "UPDATE settings SET key = replace(key, 'agents.subagents', 'agents.helpers') WHERE key LIKE '%agents.subagents%'"]
