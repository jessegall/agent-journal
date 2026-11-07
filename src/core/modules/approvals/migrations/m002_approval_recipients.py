from core.base.database.migration import Migration


class ApprovalRecipientsMigration(Migration):
    number = 2
    statements = [
        "ALTER TABLE approvals ADD COLUMN recipient_agent_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT",
        "ALTER TABLE approvals ADD COLUMN relayed_by_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT",
        "ALTER TABLE approvals ADD COLUMN answered_by_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT",
        "ALTER TABLE approvals ADD COLUMN review_answer TEXT NOT NULL DEFAULT ''",
        "CREATE INDEX approval_requests_recipient ON approvals(recipient_agent_id, state)",
        "UPDATE approvals SET recipient_agent_id = (SELECT id FROM agents WHERE role = 'main'"
        " AND environment_id = approvals.environment_id ORDER BY id DESC LIMIT 1)"
        " WHERE requester_id IN (SELECT id FROM agents WHERE role != 'main') AND state IN ('open', 'running')",
        "UPDATE approvals SET state = 'closed', version = version + 1 WHERE state IN ('open', 'running')"
        " AND json_extract(arguments, '$[0]') = 'task' AND json_extract(arguments, '$[1]') = 'unblock'",
    ]
