from engine.database.migration import Migration


class PluginRowsEnvironmentIndexMigration(Migration):
    """Indexes plugin deliveries, settings and outputs by environment, so the list of one environment reads no other row."""

    number = 10
    statements = [
        "CREATE INDEX plugin_deliveries_environment ON plugin_deliveries (environment_id, id)",
        "CREATE INDEX plugin_settings_environment ON plugin_settings (environment_id, id)",
        "CREATE INDEX plugin_outputs_environment ON plugin_outputs (environment_id, id)",
    ]
