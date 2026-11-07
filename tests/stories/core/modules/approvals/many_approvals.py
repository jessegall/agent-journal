from collections import Counter

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
        task = story.new_row_id(f'task make "Connect shop {number}" --environment main', actor=story.agent)
        story.expect_success(f'task block {task} --until-user --reason "Connect shop {number} in Settings"', actor=story.agent)
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


def test_delivering_many_notices_reads_each_agent_line_once(pending_requests, monkeypatch):
    story = pending_requests
    reads = Counter()
    original = Database.rows

    def recorded(database, statement):
        if statement.sql.startswith("SELECT * FROM agent_lines WHERE id = ?"):
            reads[tuple(statement.parameters)] += 1
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", recorded)
    story.hook("s-1", HookSamples.prompt("Continue"))
    story.expect_rows(bool(reads), all(count == 1 for count in reads.values()))


def test_a_task_wait_question_is_its_wait_reason(pending_requests):
    story = pending_requests
    requests = tuple(story.container.get(Queries).query(ApprovalRequest).oldest().all_rows())
    story.expect_rows([request.text for request in requests] == [f"Connect shop {number} in Settings" for number in range(12)])
