import sqlite3

from suites.coding.migrations.m011_worker_profile_names import WorkerProfileNamesMigration


def test_agents_and_helper_jobs_take_the_new_names_of_the_medior_and_senior_profiles():
    connection = sqlite3.connect(":memory:")
    for table in ("agents", "helper_jobs"):
        connection.execute(f"CREATE TABLE {table} (id INTEGER, profile TEXT)")
        connection.executemany(f"INSERT INTO {table} VALUES (?, ?)", [(1, "journal-medior"), (2, "journal-senior"), (3, "journal-worker"), (4, "journal-researcher")])
    connection.execute("CREATE TABLE settings (key TEXT, value TEXT)")
    connection.execute("CREATE TABLE statistics (key TEXT, value INTEGER)")
    for statement in WorkerProfileNamesMigration.statements:
        connection.execute(statement)
    for table in ("agents", "helper_jobs"):
        assert [row[0] for row in connection.execute(f"SELECT profile FROM {table} ORDER BY id")] == ["journal-worker-medior", "journal-worker-senior", "journal-worker", "journal-researcher"]


def test_the_use_counts_and_the_settings_that_name_the_profiles_take_the_new_names():
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE agents (id INTEGER, profile TEXT)")
    connection.execute("CREATE TABLE helper_jobs (id INTEGER, profile TEXT)")
    connection.execute("CREATE TABLE statistics (key TEXT, value INTEGER)")
    connection.executemany("INSERT INTO statistics VALUES (?, ?)", [("profiles.journal-medior.uses", 4), ("profiles.journal-senior.last_used", 9), ("profiles.journal-worker.uses", 1)])
    connection.execute("CREATE TABLE settings (key TEXT, value TEXT)")
    connection.execute("INSERT INTO settings VALUES ('limits', '[\"journal-medior:3\", \"journal-researcher:2\"]')")
    for statement in WorkerProfileNamesMigration.statements:
        connection.execute(statement)
    assert sorted(row[0] for row in connection.execute("SELECT key FROM statistics")) == ["profiles.journal-worker-medior.uses", "profiles.journal-worker-senior.last_used", "profiles.journal-worker.uses"]
    assert connection.execute("SELECT value FROM settings").fetchone()[0] == '["journal-worker-medior:3", "journal-researcher:2"]'
