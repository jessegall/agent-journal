from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.held_tasks import BUILD_TASK_IDS, worker_with_tasks, prove_task
from tests.stories.suites.coding.modules.workers.support.phase_steps import dispatched_story_worker

TASK_COUNT = 13
STARTED_PLAN_COUNT = 12


def test_a_commit_of_many_tasks_that_others_wait_on_reads_their_dependencies_together(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    for number in range(2, TASK_COUNT + 2):
        story.run(f'task make "Part {number}" --brief "Part {number}"', actor=story.agent)
    for waiting in (TASK_COUNT, TASK_COUNT + 1):
        story.run(f"task depend {waiting} --on 2", actor=story.agent)
    worker = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet " + " ".join(str(number) for number in range(1, TASK_COUNT)), monkeypatch)
    for number in range(2, TASK_COUNT):
        story.run(f"task start {number}", actor=worker.worker)
    for number in range(1, TASK_COUNT):
        prove_task(worker, number, 1)
    story.expect_success("worker commit --wait --differences none", actor=worker.worker)


def test_a_commit_of_the_tasks_of_a_started_plan_reads_the_next_ready_task_of_the_plan_together(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, 6, build_task_count=6)
    for number in BUILD_TASK_IDS:
        prove_task(worker, number, 1)
    worker.story.expect_success("worker commit --wait --differences none", actor=worker.worker)


def test_a_commit_with_many_plans_started_reads_the_ready_places_of_all_of_them_at_once(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, 2, build_task_count=6)
    story = worker.story
    for plan_id in range(2, STARTED_PLAN_COUNT + 1):
        story.run(f'plan make "Plan {plan_id}" --environment main', actor=story.user)
        phase_id = story.new_row_id(f'phase make --plan {plan_id} "Build"', actor=story.user)
        for number in (1, 2):
            task_id = story.new_row_id(f'task make "Plan {plan_id} task {number}" --environment main', actor=story.user)
            story.run(f"phase place {task_id} --phase {phase_id}", actor=story.user)
        ready_plan(story, plan_id, actor=story.user)
        story.run(f"plan approve {plan_id} --environment main", actor=story.user)
        story.expect_success(f"plan start {plan_id} --environment main", actor=story.user)
    for number in BUILD_TASK_IDS[:2]:
        prove_task(worker, number, 1)
    story.expect_success("worker commit --wait --differences none", actor=worker.worker)
