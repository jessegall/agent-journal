import pytest

from core.base.driver.command_category import CommandCategory
from core.base.database.database import Database
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.migrations.m030_stock_reader_catalog import StockReaderCatalogMigration
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_selection import ReaderSelection
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


@pytest.mark.parametrize(("name", "command", "category", "output"), [
    ("npm-build", "npm run build", CommandCategory.BUILD,
     "vite v6.4.5 building for production...\ntransforming...\n✓ 343 modules transformed.\nrendering chunks...\ncomputing gzip size...\n✓ built in 3.00s\n"),
    ("npm-install", "npm ci", CommandCategory.PACKAGE,
     "added 95 packages, and audited 96 packages in 1s\n\n19 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities\n"),
    ("pyright", "python3 -m pyright src", CommandCategory.CHECK,
     "0 errors, 0 warnings, 0 informations\n"),
    ("tsc", "npx tsc --noEmit missing.ts", CommandCategory.CHECK,
     "error TS6053: File 'missing.ts' not found.\n  The file is in the program because:\n    Root file specified for compilation\n"),
    ("eslint", "npx eslint missing.js", CommandCategory.CHECK,
     'Oops! Something went wrong! :(\n\nESLint: 10.14.0\n\nNo files matching the pattern "missing.js" were found.\nPlease check for typing mistakes in the pattern.\n'),
    ("pip-install", "pip3 install pip", CommandCategory.PACKAGE,
     "error: externally-managed-environment\n\n× This environment is externally managed\n"),
    ("go-test", "go -C tools/journal-run test .", CommandCategory.TEST_RUN,
     "ok  \texample.org/project/tools/runner\t1.723s\n"),
])
def test_a_stock_reader_is_proper_on_a_recorded_output(new_story, name, command, category, output):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, command, category=category)
    end_run(story, process, output)
    reader = story.container.get(ReaderQuery).filter(name=name).page(1, 1).rows[0]
    part = PartSpec(command, command.split()[0], category=category)
    story.expect_rows(ReaderSelection.reads_command(reader, command, category))
    story.expect_rows(story.container.get(ReaderDemands).reason(part, reader) == "")
    story.expect_rows(story.container.get(ReaderJudge).judged(reader, category).is_proper)


def test_the_catalog_upgrade_keeps_a_project_reader_with_the_same_name(new_story):
    story = new_story(fixture=BuilderStarted)
    reader_id = story.new_row_id('reader add npm-build --commands "custom-build*" --lines "done" --summary "done"', actor=story.agent)
    before = story.run(f"reader show {reader_id} --json", actor=story.agent).output_text
    StockReaderCatalogMigration().run(story.container.get(Database))
    story.expect_rows(story.run(f"reader show {reader_id} --json", actor=story.agent).output_text == before)
