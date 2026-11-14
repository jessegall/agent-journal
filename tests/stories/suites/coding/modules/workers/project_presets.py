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
def project(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    repository = repository_environment(story)
    return story, repository.folder


def saved(folder, path, text):
    (folder / path).parent.mkdir(parents=True, exist_ok=True)
    FileAccess.write(folder / path, text)


def test_both_manifests_are_found_a_library_folder_is_not_read_and_a_changed_manifest_counts_at_the_next_read(project):
    story, folder = project
    saved(folder, "pyproject.toml", PYPROJECT)
    saved(folder, "src/viewer/package.json", PLAIN_PACKAGE)
    saved(folder, "src/viewer/node_modules/left-pad/package.json", json.dumps({"devDependencies": {"jest": "1"}}))
    saved(folder, ".venv/lib/cart/pyproject.toml", PYPROJECT)
    saved(folder, "vendor/acme/composer.json", "{}")
    output = story.run(PRESETS, actor=story.agent).output_text
    story.expect_rows(output.splitlines() == ["manifest pyproject.toml: python", "manifest src/viewer/package.json: javascript", "test command python=python3 -m pytest"], detail=output)
    saved(folder, "src/viewer/package.json", VIEWER_PACKAGE)
    story.expect_text(PRESETS, "test command vitest=src/viewer/node_modules/.bin/vitest run --root src/viewer", actor=story.agent)


def test_a_person_preset_takes_the_place_of_the_found_command_of_its_name(project):
    story, folder = project
    saved(folder, "pyproject.toml", PYPROJECT)
    story.expect_success(f"""setting make {PRESET_TEST_COMMANDS} '["python=py.test -q"]' --environment main""", actor=story.user)
    output = story.run(PRESETS, actor=story.agent).output_text
    story.expect_rows("test command python=py.test -q" in output, "python3 -m pytest" not in output, detail=output)


def test_a_worker_dispatched_with_no_test_command_runs_the_one_found_in_the_project(project, monkeypatch):
    story, folder = project
    saved(folder, "pyproject.toml", PYPROJECT)
    worker = dispatched_story_worker(story, BARE_DISPATCH, monkeypatch)
    story.expect_text(PYTHON_RUN, "output", actor=worker.worker)
