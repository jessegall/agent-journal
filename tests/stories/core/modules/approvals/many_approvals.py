import pytest

from core.base.database.database import Database
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


@pytest.fixture
def pending_requests(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    for number in range(12):
        story.new_row_id(f'rule make "Check shop {number}"', actor=story.agent)
    requests = tuple(story.container.get(Queries).query(ApprovalRequest).oldest().all_rows())
    story.expect_rows(len(requests) == 12)
    return story


def test_several_approvals_reach_the_agent_as_one_counted_notice(pending_requests):
    story = pending_requests
    answer = story.hook("s-1", HookSamples.prompt("Continue"))
    lines = [line for line in answer.lines if "A person was asked" in line]
    story.expect_rows(lines == ["A person was asked for 12 approvals: journal approval list --state open"])
    following = story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_rows(not any("A person was asked" in line for line in following.lines))


def test_delivering_many_notices_reads_each_agent_line_once(pending_requests):
    story = pending_requests
    reads = []
    database = story.container.get(Database)
    database.connection.set_trace_callback(reads.append)
    try:
        story.hook("s-1", HookSamples.prompt("Continue"))
    finally:
        database.connection.set_trace_callback(None)
    row_reads = [sql for sql in reads if sql.startswith("SELECT * FROM agent_lines WHERE id =")]
    story.expect_rows(not row_reads)


def test_a_task_wait_does_not_create_a_person_approval(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    task = story.new_row_id('task make "Check the shop" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --until-user --reason "Ask the main agent to review the shop"', actor=story.agent)
    story.expect_rows(not tuple(story.container.get(Queries).query(ApprovalRequest).all_rows()))
