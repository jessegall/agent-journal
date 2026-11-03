from core.base.database.migration import Migration


class DockItemAgentsMigration(Migration):
    """Gives a dock item the agent it belongs to; an item with none shows in the main chat."""

    number = 5
    statements = ("ALTER TABLE dock_items ADD COLUMN agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL",
                  "CREATE INDEX dock_items_agent ON dock_items (agent_id, id)")
