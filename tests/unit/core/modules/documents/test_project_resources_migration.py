from core.base.clock import Clock
import sqlite3

from core.base.database.database import Database
from core.base.database.module_migrations import ModuleMigrations
from core.base.database.schema import Schema
from core.base.model.tables import Tables
from core.modules.documents.migrations.m001_documents import DocumentsTablesMigration
from core.modules.documents.migrations.m005_project_documents import ProjectDocumentsMigration
from core.modules.dumps.migrations.m001_dumps import DumpsTablesMigration
from core.modules.dumps.migrations.m002_project_dumps import ProjectDumpsMigration
from core.modules.dumps.models.dump_row import DumpRow


def test_existing_environment_resources_become_project_resources_without_losing_rows_or_links():
    connection = sqlite3.connect(':memory:', autocommit=True)
    database = Database.configured(connection)
    connection.executescript('''
        PRAGMA foreign_keys = ON;
        CREATE TABLE actors (id INTEGER PRIMARY KEY);
        CREATE TABLE environments (id INTEGER PRIMARY KEY);
        INSERT INTO actors VALUES (1);
        INSERT INTO environments VALUES (1), (2);
    ''')
    DocumentsTablesMigration().run(database)
    DumpsTablesMigration().run(database)
    for table in ('docs', 'reports'):
        connection.executemany(
            f'INSERT INTO {table} (id, environment_id, creator_id, title, abstract, body, created_at, updated_at)'
            ' VALUES (?, ?, 1, ?, ?, ?, ?, ?)',
            [(number, environment, 'Guide', 'Project rules', 'Whole text', '2026-01-01', '2026-01-02')
             for number, environment in ((11, 1), (12, 2), (13, None))],
        )
    connection.execute('''
        INSERT INTO doc_revisions
        (doc_id, creator_id, number, title, abstract, body, change, closes_at, created_at, updated_at)
        VALUES (11, 1, 1, 'Guide', 'Project rules', 'Whole text', 'Written', '2026-01-02', '2026-01-01', '2026-01-02')
    ''')
    connection.executemany('''
        INSERT INTO dumps (id, environment_id, creator_id, brief, created_at, updated_at)
        VALUES (?, ?, 1, 'Call notes', '2026-01-01', '2026-01-02')
    ''', [(21, 1), (22, 2)])
    connection.execute('''
        INSERT INTO dump_items (dump_id, creator_id, position, text, created_at, updated_at)
        VALUES (21, 1, 1, 'Keep this item', '2026-01-01', '2026-01-02')
    ''')
    connection.execute('CREATE VIEW dump_rows AS SELECT environment_id FROM dumps')
    rows = {table: [tuple(row) for row in connection.execute(f'SELECT * FROM {table}')]
            for table in ('docs', 'reports', 'dumps', 'doc_revisions', 'dump_items')}
    schema = Schema(database, Tables(), Clock())
    schema.migrate([
        ModuleMigrations('journal.core.documents', [ProjectDocumentsMigration()]),
        ModuleMigrations('journal.core.dumps', [ProjectDumpsMigration()]),
    ])
    schema.rebuild_views([DumpRow])
    for table in ('docs', 'reports', 'dumps'):
        assert 'environment_id' not in [row[1] for row in connection.execute(f'PRAGMA table_info({table})')]
        assert [tuple(row) for row in connection.execute(f'SELECT * FROM {table}')] == [
            (row[0], *row[2:]) for row in rows[table]
        ]
    for table in ('doc_revisions', 'dump_items'):
        assert [tuple(row) for row in connection.execute(f'SELECT * FROM {table}')] == rows[table]
    assert connection.execute('PRAGMA foreign_key_check').fetchall() == []
    assert connection.execute('SELECT text FROM dump_rows WHERE item_id = 1').fetchone()[0] == 'Keep this item'
    assert schema.migrate([
        ModuleMigrations('journal.core.documents', [ProjectDocumentsMigration()]),
        ModuleMigrations('journal.core.dumps', [ProjectDumpsMigration()]),
    ]) == []
