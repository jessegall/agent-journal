import subprocess
from pathlib import Path

import pytest

from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_run import ReaderRun
from suites.coding.modules.workers.support.test_listing import TestListing as PartListing
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row

PROJECT = Path(__file__).resolve().parents[5]


@pytest.mark.parametrize("name,command,count", [
    ("pytest", ".venv/bin/python3 -m pytest tests/stories/core/modules/processes/reader_draft.py -n 8", 12),
    ("pytest", ".venv/bin/python3 -m pytest -q tests/stories/core/modules/processes/reader_draft.py", 12),
    ("pytest", ".venv/bin/python3 -m pytest -qq tests/stories/core/modules/processes/reader_draft.py", 12),
    ("pytest", ".venv/bin/python3 -m pytest -v tests/stories/core/modules/processes/reader_draft.py", 12),
    ("pytest", ".venv/bin/python3 -m pytest -q tests/stories/core/modules/processes/reader_draft.py tests/stories/core/base/repeated_calls.py", 26),
    ("vitest", "src/viewer/node_modules/.bin/vitest run --root src/viewer --configLoader runner --reporter=dot src/viewer/tests/processMark.test.js --no-open --browser.enabled=false", 4),
    ("vitest", "src/viewer/node_modules/.bin/vitest run --root src/viewer --configLoader runner --silent=true src/viewer/tests/processMark.test.js --no-open --browser.enabled=false", 4),
])
def test_stock_listing_counts_real_project_tests(new_story, name, command, count):
    story = new_story(fixture=BuilderStarted)
    reader = story.container.get(ReaderQuery).with_name(name).page(1, 1).rows[0]
    listing = PartListing(1, reader, command)
    outcome = subprocess.run(["/bin/sh", "-c", listing.line], cwd=PROJECT, capture_output=True, text=True, timeout=120, check=False)
    expect_row(outcome, returncode=0)
    story.expect_rows(story.container.get(ReaderRun).count(reader, listing.output_text(outcome.stdout), 0) == count)
