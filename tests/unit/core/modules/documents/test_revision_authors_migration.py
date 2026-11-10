import sqlite3

from engine.database.database import Database
from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.migrations.m006_revision_authors import RevisionAuthorsMigration


def test_existing_revisions_keep_their_creator_as_author_and_text():
    connection = sqlite3.connect(':memory:', autocommit=True)
    database = Database.configured(connection)
    connection.executescript('''
        CREATE TABLE actors (id INTEGER PRIMARY KEY);
        CREATE TABLE environments (id INTEGER PRIMARY KEY);
        INSERT INTO actors VALUES (7);
    ''')
    DocumentsTablesMigration().run(database)
    connection.executescript('''
        INSERT INTO docs (id, creator_id, title, abstract, body, created_at, updated_at)
        VALUES (1, 7, 'Notes', 'Project notes', 'Kept', '2026-01-01', '2026-01-01');
        INSERT INTO doc_revisions
        (doc_id, creator_id, number, title, abstract, body, change, closes_at, created_at, updated_at)
        VALUES (1, 7, 1, 'Notes', 'Project notes', 'Kept', 'First', '2026-01-01', '2026-01-01', '2026-01-01');
    ''')
    RevisionAuthorsMigration().run(database)
    assert tuple(connection.execute('SELECT author_id, body FROM doc_revisions').fetchone()) == (7, 'Kept')
    assert connection.execute('SELECT COUNT(*) FROM open_documents').fetchone()[0] == 0
    connection.execute('UPDATE doc_revisions SET author_id = NULL')
    assert connection.execute('PRAGMA foreign_key_check').fetchall() == []
    connection.close()
