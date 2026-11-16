from engine.database.rebuild_migration import RebuildMigration


class ApprovalRecipientAgentReferenceMigration(RebuildMigration):
    """The agent an approval goes to references agents, as every column that names an agent does."""

    number = 9
    statements = (
        "CREATE TABLE approvals_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, requester_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, required_person_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, source_version INTEGER, returns_output INTEGER NOT NULL DEFAULT 0, text TEXT NOT NULL, arguments TEXT NOT NULL CHECK (json_valid(arguments)), refused_arguments TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(refused_arguments)), continued_arguments TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(continued_arguments)), state TEXT NOT NULL DEFAULT 'open', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, recipient_agent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, relayer_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, responder_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, review_answer TEXT NOT NULL DEFAULT '', command_json TEXT NOT NULL DEFAULT '', saved_approval_id INTEGER, why TEXT NOT NULL DEFAULT '', failure TEXT NOT NULL DEFAULT '') STRICT",
        "INSERT INTO approvals_rebuilt (id, environment_id, creator_id, requester_id, required_person_id, source_version, returns_output, text, arguments, refused_arguments, continued_arguments, state, version, metadata, created_at, updated_at, recipient_agent_id, relayer_id, responder_id, review_answer, command_json, saved_approval_id, why, failure) SELECT id, environment_id, creator_id, requester_id, required_person_id, source_version, returns_output, text, arguments, refused_arguments, continued_arguments, state, version, metadata, created_at, updated_at, recipient_agent_id, relayer_id, responder_id, review_answer, command_json, saved_approval_id, why, failure FROM approvals",
        "DROP TABLE approvals",
        "ALTER TABLE approvals_rebuilt RENAME TO approvals",
        "CREATE INDEX approval_requests_open ON approvals(environment_id, requester_id, state)",
        "CREATE INDEX approval_requests_action ON approvals(state, arguments)",
        "CREATE INDEX approval_requests_recipient ON approvals(recipient_agent_id, state)",
    )
