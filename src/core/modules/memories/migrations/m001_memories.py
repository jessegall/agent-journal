from core.base.actor import CORE_ACTOR_ID
from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL


class MemoriesTables(Migration):
    """Creates memories with their types, switches, keywords, deliveries and marks, and the three core types."""

    number = 1
    statements = (
        "CREATE TABLE memory_types (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " name TEXT NOT NULL UNIQUE CHECK (name GLOB '[a-z]*' AND length(name) <= 40), module TEXT NOT NULL,"
        " description TEXT NOT NULL, agent_writable INTEGER NOT NULL CHECK (agent_writable IN (0, 1)),"
        " fades INTEGER NOT NULL CHECK (fades IN (0, 1)), starting_weight INTEGER NOT NULL DEFAULT 5 CHECK (starting_weight BETWEEN 1 AND 10),"
        " start_delivery INTEGER NOT NULL DEFAULT 1, mark_delivery INTEGER NOT NULL DEFAULT 0, keyword_delivery INTEGER NOT NULL DEFAULT 1,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE memory_type_switches (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " type TEXT NOT NULL REFERENCES memory_types(name) ON DELETE CASCADE, suite TEXT NOT NULL, module TEXT NOT NULL,"
        " enabled INTEGER NOT NULL CHECK (enabled IN (0, 1)), version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (type, suite)) STRICT",
        "CREATE TABLE memories (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, type TEXT NOT NULL REFERENCES memory_types(name) ON DELETE RESTRICT,"
        " text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 400), reason TEXT NOT NULL DEFAULT '',"
        " weight INTEGER NOT NULL DEFAULT 5 CHECK (weight BETWEEN 0 AND 10), state TEXT NOT NULL DEFAULT 'active',"
        " due_at TEXT, removed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, CHECK (agent_id IS NULL OR environment_id IS NOT NULL)) STRICT",
        "CREATE INDEX memories_active ON memories (environment_id, agent_id, weight) WHERE state = 'active' AND weight > 0",
        "CREATE INDEX memories_task ON memories (task_id) WHERE task_id IS NOT NULL",
        "CREATE TABLE memory_keywords (id INTEGER PRIMARY KEY, memory_id INTEGER NOT NULL REFERENCES memories(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " word TEXT NOT NULL CHECK (word = lower(word) AND length(word) BETWEEN 2 AND 40),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (memory_id, word)) STRICT",
        "CREATE INDEX memory_keywords_word ON memory_keywords (word)",
        "CREATE TABLE memory_deliveries (id INTEGER PRIMARY KEY, memory_id INTEGER NOT NULL REFERENCES memories(id) ON DELETE CASCADE,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " cause TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX memory_deliveries_agent ON memory_deliveries (agent_id, created_at)",
        "CREATE TABLE memory_marks (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, percent INTEGER NOT NULL CHECK (percent BETWEEN 1 AND 99),"
        " state TEXT NOT NULL DEFAULT 'open', reason TEXT NOT NULL DEFAULT '', opened_at TEXT NOT NULL, closed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX memory_marks_one_open ON memory_marks (agent_id) WHERE state = 'open'",
        "INSERT INTO memory_types (creator_id, name, module, description, agent_writable, fades, starting_weight, start_delivery, mark_delivery,"
        " keyword_delivery, created_at, updated_at) VALUES"
        f" ({CORE_ACTOR_ID}, 'fact', 'journal.core.memories', 'something true here to keep in mind', 1, 1, 5, 1, 1, 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL}),"
        f" ({CORE_ACTOR_ID}, 'rule', 'journal.core.memories', 'a ruling the user made that binds every agent it reaches', 0, 0, 10, 1, 0, 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL}),"
        f" ({CORE_ACTOR_ID}, 'reminder', 'journal.core.memories', 'something to keep doing here, or to do at its due time', 1, 0, 5, 1, 0, 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL})",
        "INSERT INTO memory_type_switches (creator_id, type, suite, module, enabled, created_at, updated_at) VALUES"
        f" ({CORE_ACTOR_ID}, 'fact', '*', 'journal.core.memories', 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL}),"
        f" ({CORE_ACTOR_ID}, 'rule', '*', 'journal.core.memories', 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL}),"
        f" ({CORE_ACTOR_ID}, 'reminder', '*', 'journal.core.memories', 1, {TIMESTAMP_SQL}, {TIMESTAMP_SQL})",
    )
