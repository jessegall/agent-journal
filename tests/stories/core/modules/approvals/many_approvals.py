import pytest

from core.modules.approvals.models.approval_request import ApprovalRequest
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, UserBuilder
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client



@pytest.fixture
def pending_requests(new_story):
    story = new_story(fixture=UserBuilder)
    for number in range(12):
        story.new_row_id(f'rule make "Check shop {number}"', actor=story.agent)
    requests = tuple(story.story_rows(ApprovalRequest))
    story.expect_rows(len(requests) == 12)
    return story


@pytest.fixture
def pending_viewer(pending_requests):
    with viewer_client(pending_requests) as viewer:
        yield viewer


def test_several_approvals_reach_the_agent_as_one_counted_notice(pending_requests):
    story = pending_requests
    answer = story.hook("s-1", HookSamples.prompt("Continue"))
    lines = [line for line in answer.lines if "A user was asked" in line]
    story.expect_rows(lines == ["A user was asked for 12 approvals"])
    following = story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_rows(not any("A user was asked" in line for line in following.lines))




def test_a_task_wait_does_not_create_a_person_approval(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    task = story.new_row_id('task make "Check the shop" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --until-user --reason "Ask the main agent to review the shop"', actor=story.agent)
    story.expect_rows(not tuple(story.story_rows(ApprovalRequest)))
