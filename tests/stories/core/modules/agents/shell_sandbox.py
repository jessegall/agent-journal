import pytest

from core.base.shell_sandbox import ShellSandbox
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_helper_start_runs_the_sandbox_check(sandbox_story):
    sandbox_story.expect_refusal('helper start journal-researcher --brief "Read src/till.py" --environment main', "read-only shell sandbox")


@pytest.fixture
def sandbox_story(new_story):
    story = new_story(fixture=MainEnvironment)
    story.container.bind(ShellSandbox, ShellSandbox(story.home))
    return story
