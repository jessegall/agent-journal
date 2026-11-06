import sqlite3

import pytest

from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.migrations.m002_link_source_index import LinkSourceIndexMigration
from core.modules.documents.migrations.m007_link_corrections import LinkCorrectionsMigration


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
    assert [row[0] for row in links_database.execute("SELECT link_type FROM links ORDER BY id").fetchall()] == ["about", "edited"]


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


@pytest.fixture
def corrected_links_database(links_database):
    insert_link(links_database, "about", creator=7)
    links_database.execute("UPDATE links SET version = 4, metadata = '{\"sample\":{\"kept\":true}}'")
    for statement in LinkCorrectionsMigration.statements:
        links_database.execute(statement)
    return links_database


def test_correction_migration_preserves_links_and_identity(corrected_links_database):
    database = corrected_links_database
    assert database.execute("SELECT id, creator_id, version, metadata, created_at FROM links").fetchall() == [
        (1, 7, 4, '{"sample":{"kept":true}}', "2026-10-01")]
    with pytest.raises(sqlite3.IntegrityError):
        insert_link(database, "about")
    insert_link(database, "edited")
    assert database.execute("SELECT count(*) FROM links").fetchone()[0] == 2


def test_removed_link_numbers_are_never_reused(corrected_links_database):
    database = corrected_links_database
    database.execute("DELETE FROM links")
    insert_link(database, "edited")
    assert database.execute("SELECT id FROM links").fetchone()[0] == 2


@pytest.mark.parametrize("column", ["source", "target"])
def test_correction_migration_preserves_endpoint_indexes(corrected_links_database, column):
    plan = corrected_links_database.execute(
        f"EXPLAIN QUERY PLAN SELECT * FROM links WHERE {column}_model = ? AND {column}_id = ? AND link_type = ?",
        ("message", 1, "about")).fetchall()
    assert any("INDEX" in row[3] and "SCAN" not in row[3] for row in plan), plan
