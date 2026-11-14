import sqlite3

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.reviews.migrations.m006_review_assignments import ReviewAssignmentsMigration

CORE_ID = 1
REQUESTER_ID = 2
REVIEWER_ID = 3
REMOVED_REVIEWER_ID = 999
OLD_TABLES = (
    "CREATE TABLE environments (id INTEGER PRIMARY KEY)",
    "CREATE TABLE actors (id INTEGER PRIMARY KEY, type TEXT NOT NULL)",
    "CREATE TABLE agents (id INTEGER PRIMARY KEY)",
    "CREATE TABLE assignments (id INTEGER PRIMARY KEY AUTOINCREMENT, creator_id INTEGER NOT NULL REFERENCES actors(id), subject_model TEXT NOT NULL,"
    " subject_id INTEGER NOT NULL, actor_id INTEGER NOT NULL REFERENCES actors(id), source_id INTEGER REFERENCES assignments(id),"
    " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
    " UNIQUE (subject_model, subject_id, actor_id)) STRICT",
    "CREATE TABLE reviews (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id), subject_model TEXT NOT NULL,"
    " subject_id INTEGER NOT NULL, requester_id INTEGER NOT NULL REFERENCES actors(id), reviewer_id INTEGER REFERENCES agents(id),"
    " brief TEXT NOT NULL DEFAULT '', point_count INTEGER NOT NULL, state TEXT NOT NULL DEFAULT 'queued', report TEXT NOT NULL DEFAULT '',"
    " reported_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    "CREATE INDEX reviews_reviewer ON reviews (reviewer_id) WHERE reviewer_id IS NOT NULL",
    "CREATE TABLE review_points (id INTEGER PRIMARY KEY, review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE)",
    "INSERT INTO environments VALUES (1)",
    f"INSERT INTO actors VALUES ({CORE_ID}, 'core')", f"INSERT INTO actors VALUES ({REQUESTER_ID}, 'agent')", f"INSERT INTO actors VALUES ({REVIEWER_ID}, 'agent')",
    f"INSERT INTO agents VALUES ({REVIEWER_ID})",
    f"INSERT INTO reviews (id, environment_id, subject_model, subject_id, requester_id, reviewer_id, point_count, state, created_at, updated_at)"
    f" VALUES (7, 1, 'task', 4, {REQUESTER_ID}, {REVIEWER_ID}, 2, 'reviewing', 'then', 'then')",
    f"INSERT INTO reviews (id, environment_id, subject_model, subject_id, requester_id, point_count, created_at, updated_at)"
    f" VALUES (8, 1, 'task', 5, {REQUESTER_ID}, 1, 'then', 'then')",
    f"INSERT INTO reviews (id, environment_id, subject_model, subject_id, requester_id, reviewer_id, point_count, state, created_at, updated_at)"
    f" VALUES (9, 1, 'task', 6, {REQUESTER_ID}, {REMOVED_REVIEWER_ID}, 1, 'reviewing', 'then', 'then')",
    "INSERT INTO review_points VALUES (1, 7)",
)


def migrated(tmp_path) -> sqlite3.Connection:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    connection = sqlite3.connect(home.database)
    connection.executescript(";".join(OLD_TABLES))
    connection.close()
    database = Database.opened(home)
    ReviewAssignmentsMigration().run(database)
    database.close()
    return sqlite3.connect(home.database)


def test_the_reviewer_of_each_review_becomes_its_assignment_given_by_hand(tmp_path):
    connection = migrated(tmp_path)
    assert connection.execute("SELECT creator_id, subject_model, subject_id, actor_id, source_id FROM assignments").fetchall() == [(CORE_ID, "review", 7, REVIEWER_ID, None)]


def test_the_column_and_its_index_are_gone_and_every_review_is_kept(tmp_path):
    connection = migrated(tmp_path)
    columns = [row[1] for row in connection.execute("PRAGMA table_info(reviews)").fetchall()]
    assert "reviewer_id" not in columns
    assert connection.execute("SELECT id, state FROM reviews ORDER BY id").fetchall() == [(7, "reviewing"), (8, "queued"), (9, "reviewing")]
    assert connection.execute("SELECT name FROM sqlite_master WHERE name = 'reviews_reviewer'").fetchall() == []
    assert connection.execute("SELECT review_id FROM review_points").fetchall() == [tuple([7])]
