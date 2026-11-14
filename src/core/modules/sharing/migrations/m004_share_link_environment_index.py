from engine.database.migration import Migration


class ShareLinkEnvironmentIndexMigration(Migration):
    """Indexes the share links of an environment."""

    number = 4
    statements = ["CREATE INDEX share_links_environment ON share_links (environment_id, id)"]
