import shlex
import subprocess

import pytest

from engine.enums.command_category import CommandCategory
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.server.support.go_build import GoBuild
from tests.stories.suites.coding.modules.workers.worker_test_limit import TestLimitSetup


@pytest.mark.parametrize("selection,count", [("-run '^TestChosen$'", 1), ("-run=^TestChosen$", 1), ("-run '^TestChosen$|^TestOther$'", 2), ("", 2)])
def test_a_workers_go_listing_counts_its_selected_tests(new_story, tmp_path, selection, count):
    story = install_runner(new_story(fixture=TestLimitSetup))
    folder = tmp_path / "module"
    folder.mkdir()
    (folder / "go.mod").write_text("module example.org/counts\n\ngo 1.24\n")
    (folder / "counts_test.go").write_text('package counts\nimport "testing"\nfunc TestChosen(t *testing.T) { t.Fatal("listing ran a test") }\nfunc TestOther(t *testing.T) { t.Fatal("listing ran a test") }\n')
    process = worker_run(story, f"go -C {shlex.quote(str(folder))} test {selection}", CommandCategory.TEST_RUN)
    listings = story.container.get(WorkerTestListings)
    finished = subprocess.run(["sh", "-c", listings.line(process)], capture_output=True, text=True, timeout=30, env=GoBuild.environment())
    story.expect_rows(finished.returncode == 0, listings.count(process, finished.stdout) == count)
