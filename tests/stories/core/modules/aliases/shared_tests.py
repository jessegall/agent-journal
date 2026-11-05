import shlex
import sys
from pathlib import Path

import pytest

from core.base.caller.caller_request import CallerRequest
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted, OrchestratorWithOpenTask
from tests.stories.server.support.go_build import GoBuild
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session


class PytestSaved(StoryFixture):
    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        binary = story.home.folder / "bin" / "journal-hook"
        binary.parent.mkdir(parents=True, exist_ok=True)
        GoBuild.built("journal-hook", binary)
        story.expect_success('alias add pytest-run ".venv/bin/python3 -m pytest {args}" --category "test run" --agents', actor=story.agent)


@pytest.mark.parametrize("line", ["python3 -m pytest tests/unit", ".venv/bin/python3 -m pytest -q", ".venv/bin/pytest tests/stories"])
def test_a_second_pytest_command_names_the_saved_command(new_story, line):
    story = new_story(fixture=PytestSaved)
    story.expect_refusal(f'alias add private-tests {shlex.quote(line)} --category "test run"', "journal pytest-run", actor=story.agent)
    story.expect_text("alias list --json", '"name": "pytest-run"', actor=story.agent)


def test_vitest_can_be_saved_beside_pytest(new_story):
    story = new_story(fixture=PytestSaved)
    story.expect_success('alias add viewer-tests "npx vitest run {args}" --category "test run"', actor=story.agent)


def test_an_unknown_test_program_does_not_block_a_save(new_story):
    story = new_story(fixture=PytestSaved)
    story.expect_success('alias add custom-tests "our-private-test-tool {args}" --category "test run"', actor=story.agent)
    story.expect_success('alias add other-custom-tests "our-private-test-tool tests/other" --category "test run"', actor=story.agent)


def test_editing_a_command_cannot_duplicate_another_saved_program(new_story):
    story = new_story(fixture=PytestSaved)
    story.expect_success('alias add private-tests "echo testing"', actor=story.agent)
    story.expect_refusal('alias edit private-tests --line "pytest tests/unit" --category "test run"', "journal pytest-run", actor=story.agent)
    story.expect_success('alias edit pytest-run --about "Python tests"', actor=story.agent)


def test_go_tests_in_different_modules_can_be_saved(new_story):
    story = new_story(fixture=PytestSaved)
    story.expect_success('alias add hook-tests "go -C tools/journal-hook test {args}" --category "test run"', actor=story.agent)
    story.expect_success('alias add runner-tests "cd tools/journal-run && go test {args}" --category "test run"', actor=story.agent)
    story.expect_refusal('alias add private-hook-tests "cd tools/journal-hook && go test ./..." --category "test run"', "journal hook-tests", actor=story.agent)


def test_a_second_build_of_the_same_program_and_folder_is_refused(new_story):
    story = new_story(fixture=PytestSaved)
    story.expect_success('alias add viewer-build "cd src/viewer && npm run build {args}" --category build', actor=story.agent)
    story.expect_refusal('alias add private-build "cd src/viewer && npm run build --mode production" --category build', "journal viewer-build", actor=story.agent)


def test_a_worker_runs_the_shared_pytest_in_its_own_checkout(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success('alias add pytest-run ".venv/bin/python3 -m pytest {args}" --category "test run" --agents', actor=story.agent)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    (folder / ".venv").symlink_to(Path(sys.prefix), target_is_directory=True)
    test_file = folder / "test_python_environment.py"
    test_file.write_text("import pathlib, sys\ndef test_python():\n    assert pathlib.Path(sys.executable).parent == pathlib.Path.cwd() / '.venv' / 'bin'\n")
    result = story.run_requested("pytest-run -q test_python_environment.py", CallerRequest(variables={"JOURNAL_ACTOR": "agent", "JOURNAL_AGENT_SESSION": worker_session(story, worker)}, folder=str(folder)))
    assert result.code == 0, result.output_text
    assert "1 passed" in result.output_text
