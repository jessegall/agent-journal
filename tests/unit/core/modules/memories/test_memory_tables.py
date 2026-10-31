import sqlite3

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from tests.unit.core.modules.memories.support.memory_journal import NOW, MemoryJournal


def database(tmp_path) -> Database:
    return MemoryJournal.synced(tmp_path).database


def test_the_migration_seeds_fact_rule_and_reminder_with_their_weights_and_who_may_make_them(tmp_path):
    rows = database(tmp_path).rows(Statement("SELECT name, agents_may_make, fades, starting_weight FROM memory_types ORDER BY name"))
    assert [tuple(row) for row in rows] == [("fact", 1, 1, 5), ("reminder", 1, 0, 5), ("rule", 0, 0, 10)]


def test_each_seeded_type_is_on_in_every_suite(tmp_path):
    rows = database(tmp_path).rows(Statement("SELECT type, suite, is_on FROM memory_type_switches ORDER BY type"))
    assert [tuple(row) for row in rows] == [("fact", "*", 1), ("reminder", "*", 1), ("rule", "*", 1)]


def test_a_memory_for_one_agent_needs_its_environment(tmp_path):
    with pytest.raises(sqlite3.IntegrityError):
        database(tmp_path).insert(Statement("INSERT INTO memories (agent_id, creator_id, type, text, created_at, updated_at) VALUES (1, 1, 'fact', 'x', ?, ?)", (NOW, NOW)))


def test_a_keyword_is_lowercase_and_2_to_40_characters(tmp_path):
    db = database(tmp_path)
    memory_id = db.insert(Statement("INSERT INTO memories (environment_id, creator_id, type, text, created_at, updated_at) VALUES (1, 1, 'fact', 'x', ?, ?)", (NOW, NOW)))
    for word in ("Cart", "c", "c" * 41):
        with pytest.raises(sqlite3.IntegrityError):
            db.insert(Statement("INSERT INTO memory_keywords (memory_id, creator_id, word, created_at, updated_at) VALUES (?, 1, ?, ?, ?)", (memory_id, word, NOW, NOW)))


def test_an_agent_has_one_open_mark_at_a_time(tmp_path):
    journal = MemoryJournal.synced(tmp_path)
    db = journal.database
    insert = Statement("INSERT INTO memory_marks (agent_id, creator_id, percent, opened_at, created_at, updated_at) VALUES (?, 1, 50, ?, ?, ?)",
                       (journal.first_agent, NOW, NOW, NOW))
    db.insert(insert)
    with pytest.raises(sqlite3.IntegrityError):
        db.insert(insert)
