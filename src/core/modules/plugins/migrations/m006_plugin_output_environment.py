from core.base.database.migration import Migration


class PluginOutputEnvironmentMigration(Migration):
    number = 6
    statements = ["ALTER TABLE plugin_outputs ADD COLUMN shows_in_environment INTEGER NOT NULL DEFAULT 0",
                  "CREATE INDEX plugin_deliveries_plugin ON plugin_deliveries (plugin_id, id)"]
