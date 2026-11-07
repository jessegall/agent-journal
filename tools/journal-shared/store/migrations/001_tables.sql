CREATE TABLE server (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    server_key TEXT NOT NULL,          -- random, made once; tells this server from a new one at the same address
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
) STRICT;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE CHECK (length(name) BETWEEN 1 AND 100),
    role TEXT NOT NULL CHECK (role IN ('admin', 'edit', 'read')),
    removed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE tokens (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_digest TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL DEFAULT '',    -- "Grace's laptop"
    last_used_at TEXT,                 -- written at most once a minute
    revoked_at TEXT,
    created_at TEXT NOT NULL
) STRICT;

-- AUTOINCREMENT on the three item tables: a number is never used twice, even after a purge.
CREATE TABLE docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
    abstract TEXT NOT NULL CHECK (length(abstract) BETWEEN 1 AND 200),
    body TEXT NOT NULL,
    removed_at TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
    steps TEXT NOT NULL CHECK (json_valid(steps)),
    step_guards TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(step_guards)),
    removed_at TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
) STRICT;

CREATE TABLE checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
    command TEXT NOT NULL,
    brief TEXT NOT NULL DEFAULT '',
    interval_minutes INTEGER NOT NULL DEFAULT 0 CHECK (interval_minutes >= 0),
    removed_at TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
) STRICT;

-- Every change to every item, in order. It is the history; its newest id is the ETag of GET /state.
CREATE TABLE item_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    version INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'remove', 'restore', 'purge')),
    fields TEXT NOT NULL CHECK (json_valid(fields)),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    token_id INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL,
    UNIQUE (kind, item_id, version)
) STRICT;
