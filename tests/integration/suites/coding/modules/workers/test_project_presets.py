import json

import pytest

from engine.file.file_access import FileAccess
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import dispatched_story_worker
from suites.coding.modules.workers.support.worker_settings import PRESET_TEST_COMMANDS

VIEWER_PACKAGE = json.dumps({"name": "viewer", "devDependencies": {"vitest": "^3.0.0"}})
PLAIN_PACKAGE = json.dumps({"name": "viewer", "scripts": {"test": "echo \"Error: no test specified\" && exit 1"}})
PYPROJECT = "[project]\nname = \"cart\"\n"
BARE_DISPATCH = "worker dispatch --model sonnet 1"
PYTHON_RUN = "worker test python tests/cart.py"
PRESETS = "worker presets"


@pytest.fixture
def project(played):
    story = played(OrchestratorWithPerson)
    repository = repository_environment(story)
    return story, repository.folder


def saved(folder, path, text):
    (folder / path).parent.mkdir(parents=True, exist_ok=True)
    FileAccess.write(folder / path, text)






def test_a_worker_dispatched_with_no_test_command_runs_the_one_found_in_the_project(project):
    story, folder = project
    saved(folder, "pyproject.toml", PYPROJECT)
    worker = dispatched_story_worker(story, BARE_DISPATCH)
    story.expect_text(PYTHON_RUN, "output", actor=worker.worker)
