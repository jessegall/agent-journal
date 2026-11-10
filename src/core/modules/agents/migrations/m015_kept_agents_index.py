from engine.database.migration import Migration


class KeptAgentsIndexMigration(Migration):
    """Indexes the agents not retired by environment, role and profile, which each start and send reads."""

    number = 15
    statements = ["CREATE INDEX IF NOT EXISTS agents_kept_profile ON agents (environment_id, role, profile) WHERE retired_at IS NULL"]
