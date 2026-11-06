import re
import sqlite3
import subprocess

from core.base.database.database import Database
from core.modules.processes.migrations.m054_vitest_listing_counts import VitestListingCountsMigration
from core.modules.processes.support.stock_reader import STOCK_READERS

VITEST = next(reader for reader in STOCK_READERS if reader.name == "vitest")
LISTING = "printf '%s\\n' 'tests/a.test.js > one' 'tests/a.test.js > group > two' 'tests/b.test.js > three' run --reporter=dot"


def test_the_stock_reader_is_updated_without_changing_a_custom_reader():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE readers (name TEXT, creator_id INTEGER, count_pattern TEXT, count_command TEXT)")
    connection.executemany("INSERT INTO readers VALUES (?, ?, 'old', 'old')", [("vitest", 1), ("vitest", 2), ("pytest", 1)])
    VitestListingCountsMigration().run(Database.configured(connection))
    rows = connection.execute("SELECT name, creator_id, count_pattern, count_command FROM readers ORDER BY creator_id, name").fetchall()
    assert rows[0][2:] == ("old", "old")
    assert rows[1][2:] == (VITEST.count, VITEST.count_command)
    assert rows[2][2:] == ("old", "old")


def test_the_count_command_lists_without_a_reporter_and_the_count_reads_the_number_of_tests_it_names():
    line = VITEST.count_command.replace("{part}", LISTING)
    listed = subprocess.run(["sh", "-c", line], capture_output=True, text=True, check=True).stdout
    assert re.search(VITEST.count, listed.strip()).group(1) == "3"
