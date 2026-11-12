import json

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.status import worker_batch  # noqa: F401  (the shared fixture)

"""Book 5 of doc 1255, story 39: the tasks assigned to a worker are a kept read of the task query itself, so a new
assignment shows at once."""


def test_assigned_tasks_refresh_when_a_task_is_assigned(worker_batch):
    story, _, worker = worker_batch
    story.expect_text("worker status", "Assignments remaining: 2", actor=worker)
    story.expect_success('task make "Refund" --brief "Pay a refund" --environment main')
    story.expect_success(f"worker send {agent_number(story, worker.id)} --task 4", actor=story.agent)
    status = json.loads(story.run("worker status --json", actor=worker).output_text)
    story.expect_rows([task["id"] for task in status["assignments"]["rows"]] == [2, 3, 4])
