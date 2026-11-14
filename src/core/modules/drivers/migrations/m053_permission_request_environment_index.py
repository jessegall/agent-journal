from engine.database.migration import Migration


class PermissionRequestEnvironmentIndexMigration(Migration):
    """Indexes the permission request rows of an environment, newest first."""

    number = 53
    statements = ["CREATE INDEX permission_requests_environment ON permission_requests (environment_id, id)"]
