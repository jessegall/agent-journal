import pytest

from engine.sandbox.shell_sandbox import ShellSandbox
from tests.stories.core.support.fixtures import MainEnvironment
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE


def test_a_helper_start_runs_the_sandbox_check(sandbox_story):
    sandbox_story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --brief "Read src/till.py" --environment main', "read-only shell sandbox")


@pytest.fixture
def sandbox_story(new_story):
    story = new_story(fixture=MainEnvironment)
    story.bind(ShellSandbox, ShellSandbox(story.home))
    return story
