
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, approve_plan, dispatched_story_worker, planned_story

"""A unit of more than fifty tasks is worked under the read limit: every read is paged or counted."""

EXTRA_TASK_COUNT = 56


def test_a_unit_of_sixty_tasks_is_worked_under_the_read_limit(new_story, monkeypatch):
    story = planned_story(new_story, approve=False)
    for place in range(EXTRA_TASK_COUNT):
        task_id = story.new_row_id(f'task make "Receipt {place}" --environment main')
        story.run(f"phase place {task_id} --phase 1")
    approve_plan(story)
    worker = dispatched_story_worker(story, PLAN_DISPATCH, monkeypatch)
    worker.story.expect_text("worker status", "Unit: plan 1", actor=worker.worker)
    commit_tasks_singly(worker, tuple([1]))
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    worker.story.expect_text("merge-ask show 1 --environment main", "unit_name: plan 1", actor=worker.story.agent)
