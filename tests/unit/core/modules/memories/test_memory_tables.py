import sqlite3

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from tests.unit.core.modules.memories.support.memory_journal import NOW, MemoryJournal


def database(tmp_path) -> Database:
    return MemoryJournal.synced(tmp_path).database




def test_a_memory_for_one_agent_needs_its_environment(tmp_path):
    with pytest.raises(sqlite3.IntegrityError):
        database(tmp_path).insert(Statement("INSERT INTO memories (agent_id, creator_id, text, created_at, updated_at) VALUES (1, 1, 'x', ?, ?)", (NOW, NOW)))


def test_a_keyword_is_lowercase_and_2_to_40_characters(tmp_path):
    db = database(tmp_path)
    memory_id = db.insert(Statement("INSERT INTO memories (environment_id, creator_id, text, created_at, updated_at) VALUES (1, 1, 'x', ?, ?)", (NOW, NOW)))
    for word in ("Cart", "c", "c" * 41):
        with pytest.raises(sqlite3.IntegrityError):
            db.insert(Statement("INSERT INTO memory_keywords (memory_id, creator_id, word, created_at, updated_at) VALUES (?, 1, ?, ?, ?)", (memory_id, word, NOW, NOW)))


def test_an_agent_has_one_open_mark_at_a_time(tmp_path):
    journal = MemoryJournal.synced(tmp_path)
    db = journal.database
    insert = Statement("INSERT INTO memory_marks (session_agent_id, creator_id, percent, opened_at, created_at, updated_at) VALUES (?, 1, 50, ?, ?, ?)",
                       (journal.first_agent, NOW, NOW, NOW))
    db.insert(insert)
    with pytest.raises(sqlite3.IntegrityError):
        db.insert(insert)
