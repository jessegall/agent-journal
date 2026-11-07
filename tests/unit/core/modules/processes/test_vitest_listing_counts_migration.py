import re
import sqlite3
import subprocess

from core.base.database.database import Database
from core.modules.processes.migrations.m054_vitest_listing_counts import VitestListingCountsMigration
from core.modules.processes.migrations.m055_vitest_summary_counts import VitestSummaryCountsMigration
from core.modules.processes.support.count_command import CountCommand
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


def test_a_journal_that_ran_the_listing_migration_gets_the_summary_count_too():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE readers (name TEXT, creator_id INTEGER, count_pattern TEXT, count_command TEXT)")
    connection.executemany("INSERT INTO readers VALUES (?, ?, '^([0-9]+)$', 'listing')", [("vitest", 1), ("vitest", 2)])
    VitestSummaryCountsMigration().run(Database.configured(connection))
    rows = [tuple(row) for row in connection.execute("SELECT count_pattern, count_command FROM readers ORDER BY creator_id").fetchall()]
    assert rows == [(VITEST.count, VITEST.count_command), ("^([0-9]+)$", "listing")]
    assert re.search(VITEST.count, "      Tests  1 failed | 2 passed (3)").group(2) == "3"


def test_the_count_command_counts_the_tests_a_quoted_alternation_selects(tmp_path):
    tool = tmp_path / "tool"
    tool.write_text("#!/bin/sh\n[ \"$1 $2\" = \"list -t\" ] && printf '%s\\n' 'a.test.js > one' 'a.test.js > two' 'b.test.js > three' | grep -E \"$3\"\n")
    tool.chmod(0o755)
    line = CountCommand.filled(VITEST.count_command, f"{tool} run -t 'one|two' --reporter=dot")
    listed = subprocess.run(["sh", "-c", line], capture_output=True, text=True, check=True).stdout
    assert re.search(VITEST.count, listed.strip()).group(1) == "2"


def test_the_count_command_counts_the_tests_a_text_with_an_apostrophe_selects(tmp_path):
    tool = tmp_path / "tool"
    tool.write_text("#!/bin/sh\n[ \"$1 $2\" = \"list -t\" ] && printf '%s\\n' 'a.test.js > it'\"'\"'s one' 'a.test.js > two' 'b.test.js > it'\"'\"'s three' | grep -F -- \"$3\"\n")
    tool.chmod(0o755)
    part = f'{tool} run -t "it\'s" --reporter=dot'
    line = CountCommand.filled(VITEST.count_command, part)
    listed = subprocess.run(["sh", "-c", line], capture_output=True, text=True, check=True).stdout
    assert re.search(VITEST.count, listed.strip()).group(1) == "2"


def test_a_command_that_holds_the_part_unquoted_runs_it_as_the_line_itself():
    assert CountCommand.filled("{part} --collect-only -q", "pytest tests/a.py") == "pytest tests/a.py --collect-only -q"
