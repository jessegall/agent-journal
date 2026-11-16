from engine.database.migration import Migration

ROW_COLUMNS = "version, metadata, created_at, updated_at"
SKIP_STATE = ("CASE WHEN skip.cancelled_at IS NOT NULL THEN 'withdrawn' WHEN skip.used_at IS NOT NULL THEN 'spent' WHEN skip.approved_at IS NOT NULL THEN 'approved'"
              " WHEN skip.confirmed_at IS NOT NULL THEN 'confirmed' ELSE 'held' END")
PERMISSION_STATE = "CASE permission.state WHEN 'allowed' THEN 'approved' WHEN 'used' THEN 'spent' WHEN 'declined' THEN 'declined' ELSE 'held' END"
GRANT_COLUMNS = ("session_agent_id, environment_id, grant_type, policy_key, target, action_fingerprint, asker_id, reason, grant_state, responder_id, tried,"
                 " skips_in_a_row, requires_approval, confirmed_at, approved_at, restored_at, moved_from")
MOVED_RECEIPT = ("FROM driver_grant_sources AS source JOIN driver_grants AS moved ON moved.id = source.grant_id WHERE source.legacy_id = used_grant_records.grant_id"
                 " AND moved.session_agent_id = used_grant_records.session_agent_id AND moved.policy_key = used_grant_records.policy_key")


class GrantsInOneTableMigration(Migration):
    """Every grant lives in driver_grants: each refusal or guard skip and each permission request moves into it with
    its state, its asker, its reason, its approval and its times, driver_grant_sources keeps the id each had in its
    old table, a receipt, which names its grant by that old id and is told apart by its agent and policy key, points
    at the moved row, the two old tables go, and every block gets its scopes from its stop-only column before that column goes."""

    number = 82
    statements = [
        "ALTER TABLE driver_grants ADD COLUMN skips_in_a_row INTEGER NOT NULL DEFAULT 1",
        "ALTER TABLE driver_grants ADD COLUMN requires_approval INTEGER NOT NULL DEFAULT 0 CHECK (requires_approval IN (0, 1))",
        "ALTER TABLE driver_grants ADD COLUMN confirmed_at TEXT",
        "ALTER TABLE driver_grants ADD COLUMN approved_at TEXT",
        "ALTER TABLE driver_grants ADD COLUMN restored_at TEXT",
        "ALTER TABLE driver_grants ADD COLUMN moved_from INTEGER",
        "CREATE TABLE driver_grant_sources (grant_type TEXT NOT NULL, legacy_id INTEGER NOT NULL, grant_id INTEGER NOT NULL REFERENCES driver_grants(id) ON DELETE CASCADE,"
        " PRIMARY KEY (grant_type, legacy_id)) STRICT",
        f"INSERT INTO driver_grants ({GRANT_COLUMNS}, {ROW_COLUMNS})"
        f" SELECT skip.session_agent_id, agent.environment_id, 'refusal-skip', skip.name, '', '', skip.creator_id, skip.reason, {SKIP_STATE}, NULL, skip.tried,"
        " skip.streak, skip.requires_approval, skip.confirmed_at, skip.approved_at, skip.restored_at, skip.id,"
        " skip.version, skip.metadata, skip.created_at, skip.updated_at FROM refusal_skips AS skip JOIN agents AS agent ON agent.id = skip.session_agent_id ORDER BY skip.id",
        "INSERT INTO driver_grant_sources (grant_type, legacy_id, grant_id) SELECT 'refusal-skip', moved_from, id FROM driver_grants WHERE moved_from IS NOT NULL",
        "UPDATE driver_grants SET moved_from = NULL",
        f"INSERT INTO driver_grants ({GRANT_COLUMNS}, {ROW_COLUMNS})"
        f" SELECT permission.asker_id, permission.environment_id, 'permission', permission.action, '', '', permission.asker_id, permission.reason, {PERMISSION_STATE},"
        " permission.responder_id, '', 1, permission.requires_person, NULL, NULL, NULL, permission.id,"
        " permission.version, permission.metadata, permission.created_at, permission.updated_at FROM permission_requests AS permission ORDER BY permission.id",
        "INSERT INTO driver_grant_sources (grant_type, legacy_id, grant_id) SELECT 'permission', moved_from, id FROM driver_grants WHERE moved_from IS NOT NULL",
        f"UPDATE used_grant_records SET grant_id = (SELECT source.grant_id {MOVED_RECEIPT}) WHERE EXISTS (SELECT 1 {MOVED_RECEIPT})",
        "ALTER TABLE driver_grants DROP COLUMN moved_from",
        "DROP TABLE refusal_skips",
        "DROP TABLE permission_requests",
        "UPDATE agent_blocks SET scope_tools = 1 - blocks_stop, scope_stop = blocks_stop WHERE scope_tools IS NULL OR scope_stop IS NULL",
        "ALTER TABLE agent_blocks DROP COLUMN blocks_stop",
    ]
