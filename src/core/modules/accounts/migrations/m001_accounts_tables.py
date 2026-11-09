from core.base.database.migration import Migration


class AccountsTablesMigration(Migration):
    """Creates the tables of a hosted journal's accounts: logins, sessions, factors and what they leave behind."""

    number = 1
    statements = (
        "CREATE TABLE person_logins (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, person_id INTEGER NOT NULL UNIQUE REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL UNIQUE, password_digest TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE person_sessions (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, token_digest TEXT NOT NULL UNIQUE, device TEXT NOT NULL, address TEXT NOT NULL, last_active_at TEXT NOT NULL, factor_checked_at TEXT NOT NULL, expires_at TEXT NOT NULL, ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE login_attempts (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, address_digest TEXT NOT NULL, name TEXT NOT NULL, attempted_at TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE person_factors (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, factor_type TEXT NOT NULL CHECK (factor_type IN ('passkey', 'app_code')), label TEXT NOT NULL, credential TEXT NOT NULL, removed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE recovery_codes (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, code_digest TEXT NOT NULL UNIQUE, used_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE audit_entries (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, person_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, event_type TEXT NOT NULL, address TEXT NOT NULL, device TEXT NOT NULL, detail TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE setup_codes (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, code_digest TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, used_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
