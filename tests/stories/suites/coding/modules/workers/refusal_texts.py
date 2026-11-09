import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.models.enums.ask_topic import AskTopic
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with
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


def test_a_change_in_a_protected_folder_ends_with_the_ask_line(working):
    story, repository, worker = working
    story.expect_success('setting set journal.suites.coding.workers.protected-folders \'["cart.py"]\' --project', actor=story.user)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    expect_refused_with(story, DELIVERY, "cart.py is protected", AskTopic.TOOL.question_line(), actor=worker)
