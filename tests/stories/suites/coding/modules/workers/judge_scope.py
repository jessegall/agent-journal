from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, DISPATCH, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder, judged_data, judged_files
from tests.stories.support.story_checks import expect_value, expect_value_with


pytestmark = pytest.mark.real_git

MERGED_TAX = "TAX = 22\n"


def judged_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("tax.py", "TAX = 1\n", "The first tax")
    return story, repository


@pytest.fixture
def judged_worker(new_story):
    story, repository = judged_story(new_story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    return story, repository, worker


@pytest.fixture
def two_task_worker(new_story):
    story, repository = judged_story(new_story)
    story.expect_success('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, actor=worker)
    return story, repository, worker


def base_merged(story, worker):
    story.expect_success(f'worker send --wait {agent_number(story, worker.id)} "go on"', actor=story.agent)


def test_a_worker_whose_base_moved_sends_the_judge_only_its_own_files(judged_worker):
    story, repository, worker = judged_worker
    repository.committed("first.py", "FIRST = 1\n", "The first move of the base")
    base_merged(story, worker)
    repository.committed("second.py", "SECOND = 2\n", "The second move of the base")
    base_merged(story, worker)
    story.expect_success(DELIVERY, actor=worker)
    expect_value(judged_files(story), ["cart.py"])


def test_an_earlier_task_of_the_worker_stays_on_the_list_at_a_later_hand_in(two_task_worker):
    story, repository, worker = two_task_worker
    story.expect_success("task start 2", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    repository.changed(worker.id, "second.py", "SECOND = 1\n")
    story.expect_success('proof make 1 --task 2 "second.py:1, the second story"', actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    expect_value(judged_files(story), ["cart.py", "second.py"])
