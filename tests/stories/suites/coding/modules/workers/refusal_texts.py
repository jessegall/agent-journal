import pytest

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.models.enums.ask_topic import AskTopic
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
WORKER_TAX = "TAX = 2\n"
MAIN_TAX = "TAX = 3\n"


@pytest.fixture
def working(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, dispatched_worker(story)


def test_a_command_type_refused_for_a_worker_ends_with_the_ask_line(working):
    story, _, worker = working
    unknown_command = HookSamples.shell("frobnicate now", ShellPart("frobnicate", CommandCategory.UNKNOWN, ["now"]))
    story.expect_hook_refusal(worker_session(story, worker), unknown_command, AskTopic.TOOL.question_line())
