from typing import NamedTuple

import pytest

from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.testing.story import Story
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client


class TaskApproval(NamedTuple):
    story: Story
    task_id: int
    request: ApprovalRequest


@pytest.fixture
def pending_task(new_story):
    story = new_story(fixture=BuilderWithUser)
    task = story.new_row_id('task make "Connect the shop" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --until-user --reason "Connect the shop account"', actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    story.expect_rows(request is not None, "Connect the shop account" in request.text)
    return TaskApproval(story, task, request)


@pytest.fixture
def waiting_viewer(pending_task):
    with viewer_client(pending_task.story) as viewer:
        yield viewer


@pytest.mark.parametrize("decision,state", [("accept", TaskState.OPEN), ("refuse", TaskState.BLOCKED)])
def test_a_task_waiting_on_a_person_creates_its_card_without_an_unblock_attempt(pending_task, waiting_viewer, decision, state):
    story, task_id, request = pending_task
    waiting_viewer.value("messages.chat", ["approval", decision, str(request.id)])
    task = story.container.get(Queries).query(Task).find(task_id)
    story.expect_rows(task.state is state)
