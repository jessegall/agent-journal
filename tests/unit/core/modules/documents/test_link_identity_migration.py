import sqlite3

import pytest

from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.migrations.m002_link_source_index import LinkSourceIndexMigration


@pytest.fixture
def links_database():
    database = sqlite3.connect(":memory:")
    for migration in (DocumentsTablesMigration, LinkSourceIndexMigration):
        for statement in migration.statements:
            database.execute(statement)
    yield database
    database.close()


def insert_link(database, relation: str, creator: int = 1) -> None:
    database.execute("INSERT INTO links (creator_id, source_model, source_id, target_model, target_id, link_type, created_at, updated_at) "
                     "VALUES (?, 'message', 1, 'task', 2, ?, '2026-10-01', '2026-10-01')", (creator, relation))


def test_existing_migration_already_keeps_relation_type_in_identity(links_database):
    insert_link(links_database, "about")
    insert_link(links_database, "edited")
    assert links_database.execute("SELECT link_type FROM links ORDER BY id").fetchall() == [("about",), ("edited",)]


def test_duplicate_identity_cannot_replace_earliest_actor_or_timestamp(links_database):
    insert_link(links_database, "about")
    with pytest.raises(sqlite3.IntegrityError):
        insert_link(links_database, "about", creator=9)
    assert links_database.execute("SELECT creator_id, created_at FROM links").fetchall() == [(1, "2026-10-01")]


@pytest.mark.parametrize("column", ["source", "target"])
def test_both_endpoint_queries_have_existing_indexes(links_database, column):
    plan = links_database.execute(f"EXPLAIN QUERY PLAN SELECT * FROM links WHERE {column}_model = ? AND {column}_id = ? AND link_type = ?",
                                  ("message", 1, "about")).fetchall()
    assert any("INDEX" in row[3] and "SCAN" not in row[3] for row in plan), plan
