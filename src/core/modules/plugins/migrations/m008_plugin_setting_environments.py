from engine.database.migration import Migration
from core.modules.plugins.migrations.m001_plugins import ROW_COLUMNS


class PluginSettingEnvironmentsMigration(Migration):
    number = 8
    statements = (
        "CREATE TABLE plugin_settings_new (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, value TEXT NOT NULL CHECK (json_valid(value)),"
        f" environment_id INTEGER REFERENCES environments(id) ON DELETE CASCADE, {ROW_COLUMNS}) STRICT",
        "INSERT INTO plugin_settings_new (id, plugin_id, creator_id, key, value, version, metadata, created_at, updated_at)"
        " SELECT id, plugin_id, creator_id, key, value, version, metadata, created_at, updated_at FROM plugin_settings",
        "DROP TABLE plugin_settings",
        "ALTER TABLE plugin_settings_new RENAME TO plugin_settings",
        "CREATE UNIQUE INDEX plugin_setting_project ON plugin_settings (plugin_id, key) WHERE environment_id IS NULL",
        "CREATE UNIQUE INDEX plugin_setting_environment ON plugin_settings (plugin_id, key, environment_id) WHERE environment_id IS NOT NULL",
        "CREATE INDEX plugin_setting_plugin ON plugin_settings (plugin_id)",
    )
