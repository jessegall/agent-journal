from engine.database.migration import Migration


class SettingRequestEnvironmentIndexMigration(Migration):
    """Indexes the setting request rows of an environment, newest first."""

    number = 3
    statements = ["CREATE INDEX setting_requests_environment ON setting_requests (environment_id, id)"]
