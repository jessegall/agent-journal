import pytest

from core.base.shell_sandbox import ShellSandbox
from tests.stories.core.support.fixtures import MainEnvironment


@pytest.mark.parametrize("script", ["exit 125", "printf 'unprotected\\n'"])
def test_a_helper_refuses_a_failed_sandbox_check(sandbox_story, script):
    story = sandbox_story
    binary = story.home.folder / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text(f"#!/bin/sh\n{script}\n")
    binary.chmod(0o755)
    story.expect_refusal("agent start helper-1 claude helper --environment main", "read-only shell sandbox")


def test_a_helper_starts_after_a_verified_sandbox_check(sandbox_story):
    story = sandbox_story
    binary = story.home.folder / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text("#!/bin/sh\n[ \"$1\" = --sandbox-check ] || exit 125\nprintf 'macos-sandbox\\n'\n")
    binary.chmod(0o755)
    story.expect_text("agent start helper-1 claude helper --environment main", "session: helper-1")


def test_a_helper_start_runs_the_sandbox_check(sandbox_story):
    sandbox_story.expect_refusal('helper start journal-researcher --brief "Read src/till.py" --environment main', "read-only shell sandbox")


def test_a_helper_refuses_a_missing_sandbox_runner(sandbox_story):
    story = sandbox_story
    story.expect_refusal("agent start helper-1 claude helper --environment main", "read-only shell sandbox")


@pytest.fixture
def sandbox_story(new_story):
    story = new_story(fixture=MainEnvironment)
    story.container.bind(ShellSandbox, ShellSandbox(story.home))
    return story
