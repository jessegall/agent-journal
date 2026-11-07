from core.base.database.migration import Migration


class ApprovalRequestsMigration(Migration):
    number = 1
    statements = [
        "CREATE TABLE approvals (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, requester_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " required_person_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, text TEXT NOT NULL,"
        " arguments TEXT NOT NULL CHECK (json_valid(arguments)), refused_arguments TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(refused_arguments)),"
        " continued_arguments TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(continued_arguments)),"
        " state TEXT NOT NULL DEFAULT 'open', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX approval_requests_open ON approvals(environment_id, requester_id, state)",
        "CREATE INDEX approval_requests_action ON approvals(state, arguments)",
    ]
