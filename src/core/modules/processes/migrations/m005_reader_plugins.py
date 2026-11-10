from engine.database.migration import Migration


class ReaderPluginsMigration(Migration):
    """Names the plugin a reader came with, so it goes with the plugin."""

    number = 5
    statements = tuple(["ALTER TABLE readers ADD COLUMN plugin_name TEXT NOT NULL DEFAULT ''"])
