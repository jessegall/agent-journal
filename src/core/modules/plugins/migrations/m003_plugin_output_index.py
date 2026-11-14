from engine.database.migration import Migration


class PluginOutputIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 3
    statements = [
        'CREATE INDEX plugin_outputs_plugin ON plugin_outputs (plugin_id)',
    ]
