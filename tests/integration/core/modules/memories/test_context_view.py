import sqlite3

from core.modules.memories.models.support.views import CONTEXT_MEMORIES_SELECT

AGENT_ID = 7


def counted_memories(deliveries: list[tuple[int, str]], session_starts: list[str | None], compacted_at: str | None = None) -> list[int]:
    database = sqlite3.connect(":memory:")
    database.executescript(
        "CREATE TABLE memory_deliveries (id INTEGER PRIMARY KEY, session_agent_id INTEGER, memory_id INTEGER, cause TEXT, created_at TEXT);"
        "CREATE TABLE hook_calls (id INTEGER PRIMARY KEY, session_agent_id INTEGER, hook TEXT, created_at TEXT);"
        "CREATE TABLE agent_sessions (id INTEGER PRIMARY KEY, session_agent_id INTEGER, started_at TEXT, created_at TEXT);"
    )
    database.executemany("INSERT INTO memory_deliveries (session_agent_id, memory_id, cause, created_at) VALUES (?, ?, 'start', ?)", [(AGENT_ID, memory_id, delivered_at) for memory_id, delivered_at in deliveries])
    database.executemany("INSERT INTO agent_sessions (session_agent_id, started_at, created_at) VALUES (?, ?, ?)", [(AGENT_ID, started_at, "2026-10-31T09:00") for started_at in session_starts])
    if compacted_at is not None:
        database.execute("INSERT INTO hook_calls (session_agent_id, hook, created_at) VALUES (?, 'compact', ?)", (AGENT_ID, compacted_at))
    return [row[2] for row in database.execute(CONTEXT_MEMORIES_SELECT)]


def test_a_delivery_from_before_the_current_session_started_does_not_count():
    assert counted_memories([(1, "2026-10-31T10:00")], ["2026-10-31T09:00", "2026-10-31T11:00"]) == []


def test_a_delivery_after_the_last_compaction_and_the_session_start_counts():
    assert counted_memories([(1, "2026-10-31T10:00"), (2, "2026-10-31T12:00")], ["2026-10-31T09:00"], compacted_at="2026-10-31T11:00") == [2]


def test_a_resume_adds_no_session_and_leaves_the_delivery_counted():
    assert counted_memories([(1, "2026-10-31T10:00")], ["2026-10-31T09:00"]) == [1]


def test_a_session_that_has_not_started_counts_from_the_time_it_was_made():
    assert counted_memories([(1, "2026-10-31T08:00")], ["2026-10-31T07:00", None]) == []


def test_an_agent_without_session_history_counts_every_delivery_since_its_compaction():
    assert counted_memories([(1, "2026-10-31T10:00")], []) == [1]
