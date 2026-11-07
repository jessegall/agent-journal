from core.base.database.migration import Migration


class PluginQueueIndexMigration(Migration):
    """Indexes queued plugin files by plugin and name."""

    number = 2
    statements = ["CREATE INDEX plugin_queue_files_plugin_name ON plugin_queue_files (plugin_id, name)"]
