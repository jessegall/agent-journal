from tests.stories.core.support.fixtures import UserJoined
from core.modules.processes.models.reader import Reader
from engine.query.queries import Queries
import pytest

from engine.enums.command_category import CommandCategory
from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.migrations.m030_stock_reader_catalog import StockReaderCatalogMigration
from core.modules.processes.migrations.m037_more_tool_stock_readers import FIRST_BATCH_READERS, NEW_READERS
from core.modules.processes.migrations.m049_pytest_listing_counts import PytestListingCountsMigration
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.stock_reader import STOCK_READERS
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from tests.stories.core.modules.processes.support.stock_samples import STOCK_SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderStarted


@pytest.mark.parametrize("sample", STOCK_SAMPLES, ids=[sample.name for sample in STOCK_SAMPLES])
def test_a_stock_reader_is_proper_on_a_recorded_output(new_story, sample):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, sample.command, category=sample.category)
    end_run(story, process, sample.output)
    reader = story.container.get(ReaderQuery).filter(name=sample.name).page(1, 1).rows[0]
    part = PartSpec(sample.command, sample.command.split()[0], category=sample.category)
    story.expect_rows(ReaderSelection.reads_command(reader, sample.command, sample.category))
    story.expect_rows(bool(story.container.get(ReaderRun).summary(reader, sample.output)))
    story.expect_rows(story.container.get(ReaderDemands).reason(part, reader, ReaderSampleScope(story.agent.id, part.text)) == "")
    story.expect_rows(story.container.get(ReaderJudge).judged(reader, sample.category).is_valid)


def test_the_catalog_upgrade_keeps_a_project_reader_with_the_same_name(new_story):
    story = new_story(fixture=BuilderStarted)
    reader_id = story.new_row_id('reader add npm-build --commands "custom-build*" --lines "done" --summary "done"', actor=story.agent)
    original_reader = story.run(f"reader show {reader_id} --json", actor=story.agent).output_text
    StockReaderCatalogMigration().run(story.container.get(Database))
    story.expect_rows(story.run(f"reader show {reader_id} --json", actor=story.agent).output_text == original_reader)


def test_the_pytest_listing_upgrade_updates_the_stock_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    database = story.container.get(Database)
    database.update(Statement("UPDATE readers SET count_pattern = ? WHERE name = ? AND creator_id = 1", ["old pattern", "pytest"]))
    PytestListingCountsMigration().run(database)
    reader = story.container.get(ReaderQuery).with_name("pytest").first()
    story.expect_rows(story.container.get(ReaderRun).count(reader, "tests/a.py: 3\ntests/b.py: 4\n", 0) == 7)


def test_a_quiet_go_build_has_a_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    reader = story.container.get(ReaderQuery).filter(name="go-build").page(1, 1).rows[0]
    part = PartSpec("go build ./...", "go", category=CommandCategory.BUILD)
    story.expect_rows(ReaderSelection.reads_command(reader, part.text, part.category))
    story.expect_rows(story.container.get(ReaderDemands).reason(part, reader, ReaderSampleScope(story.agent.id, part.text)) == "")


@pytest.mark.parametrize(("name", "output", "count"), [
    ("cargo-test", "running 2 tests\ntest first ... ok\ntest second ... FAILED\ntest result: FAILED. 1 passed; 1 failed; 0 ignored\n", 2),
    ("jest", "PASS tests/example.test.js\nTest Suites: 1 passed, 1 total\nTests: 2 passed, 2 total\n", 2),
])
def test_test_totals(new_story, name, output, count):
    story = new_story(fixture=BuilderStarted)
    reader = story.container.get(ReaderQuery).filter(name=name).page(1, 1).rows[0]
    run = story.container.get(ReaderRun)
    story.expect_rows(run.count(reader, output, 0) == count)
    story.expect_rows(story.container.get(ReaderJudge).misses(reader, CommandCategory.TEST_RUN, output) == ())


def test_nextest_output(new_story):
    story = new_story(fixture=BuilderStarted)
    command = "cargo nextest run"
    output = "Starting 2 tests across 1 binary\n    PASS [   0.005s] example first\n    FAIL [   0.004s] example second\n     Summary [   0.021s] 2 tests run: 1 passed, 1 failed\n"
    reader = story.container.get(ReaderQuery).filter(name="cargo-nextest").page(1, 1).rows[0]
    story.expect_rows(ReaderSelection.reads_command(reader, command, CommandCategory.TEST_RUN))
    story.expect_rows(story.container.get(ReaderRun).count(reader, output, 0) == 2)
    story.expect_rows(story.container.get(ReaderJudge).misses(reader, CommandCategory.TEST_RUN, output) == ())


def test_go_vet_output(new_story):
    story = new_story(fixture=BuilderStarted)
    command = "go vet ./..."
    output = "# example.org/project\n./example.go:12:3: suspicious call\n"
    reader = story.container.get(ReaderQuery).filter(name="go-vet").page(1, 1).rows[0]
    story.expect_rows(ReaderSelection.reads_command(reader, command, CommandCategory.CHECK))
    story.expect_rows(story.container.get(ReaderJudge).misses(reader, CommandCategory.CHECK, output) == ())


def test_every_stock_reader_is_stored_and_none_is_a_default(new_story):
    story = new_story(fixture=BuilderStarted)
    stored = {reader.name: reader for reader in story.container.get(ReaderQuery).filter(creator_id=1).page(1, 500).rows}
    new_readers = [stock for stock in STOCK_READERS if stock.name in NEW_READERS + FIRST_BATCH_READERS]
    story.expect_rows(sorted(stock.name for stock in STOCK_READERS if stock.name not in stored) == [])
    story.expect_rows(sorted(stock.name for stock in new_readers if (stored[stock.name].step_pattern, stored[stock.name].count_pattern) != (stock.step, stock.count)) == [])
    story.expect_rows(sorted(name for name, reader in stored.items() if reader.is_default) == [])


@pytest.mark.parametrize("line", ["collected 20 items / 19 deselected / 1 selected", "1/20 tests collected (19 deselected) in 0.05s"])
def test_a_filtered_pytest_collect_counts_only_the_selected_tests(new_story, line):
    story = new_story(fixture=UserJoined)
    pytest_reader = story.container.get(Queries).query(Reader).filter(name="pytest").first()
    story.expect_rows(story.container.get(ReaderRun).count(pytest_reader, line, 0) == 1)
