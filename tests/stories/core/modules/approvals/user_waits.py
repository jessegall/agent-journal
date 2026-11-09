from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_a_task_wait_keeps_its_reason_without_asking_the_person(new_story):
    story = new_story(fixture=UserBuilder)
    task = story.new_row_id('task make "Connect the shop" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --until-user --reason "Connect the shop account"', actor=story.agent)
    saved = story.container.get(Queries).query(Task).find(task)
    story.expect_rows(saved.state is TaskState.BLOCKED, saved.reason == "Connect the shop account",
                      not tuple(story.container.get(Queries).query(ApprovalRequest).all_rows()))
    story.expect_success(f"task unblock {task}", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(Task).find(task).state is TaskState.OPEN)
    story.expect_rows(not tuple(story.container.get(Queries).query(ApprovalRequest).all_rows()))
