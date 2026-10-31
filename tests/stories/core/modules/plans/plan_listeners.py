from tests.stories.core import story_lines as lines
from tests.stories.core.fixtures import PlanTasksPlaced

PROTECTED_TASKS = "tests.stories.core.modules.plans.samples:ProtectedTasksModule"


def plan_with_placed_tasks(new_story, *modules: str):
    return new_story(*modules, fixture=PlanTasksPlaced)


def test_cancelling_a_plan_cancels_its_open_tasks_in_the_same_transaction(new_story):
    story = plan_with_placed_tasks(new_story)
    story.expect_success(lines.PLAN_CANCEL, "state: cancelled")
    story.expect_success(lines.TASK_DETAILS, "state: cancelled", "reason: plan 1 was cancelled")
    story.expect_success("task show 2", "state: cancelled")


def test_a_refused_task_cancel_undoes_the_whole_plan_cancel(new_story):
    story = plan_with_placed_tasks(new_story, PROTECTED_TASKS)
    story.run('task make "Keep" --environment main')
    story.run("phase place 3 --phase 1")
    story.expect_refusal(lines.PLAN_CANCEL, "refused by samples.protected-task: a task titled Keep is never cancelled")
    story.expect_success("plan show 1", "state: draft")
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_closing_a_task_of_a_started_plan_starts_the_next_for_the_same_agent(new_story):
    story = plan_with_placed_tasks(new_story)
    for move in ("ready", "approve", "start"):
        story.run(f"plan {move} 1")
    story.run(lines.TASK_START, actor=story.agent)
    story.run(lines.TASK_CLOSE, actor=story.agent)
    story.expect_success("task show 2", "state: started", f"holder_id: {story.agent.id}")


def test_a_commit_listener_that_fails_three_times_is_skipped_and_the_cancel_stands(new_story):
    story = plan_with_placed_tasks(new_story, "tests.stories.core.modules.plans.samples:FailingNoticeModule")
    story.expect_success(lines.PLAN_CANCEL, "state: cancelled")
    for line_number in range(3):
        story.run(f'task log 1 "checked {line_number}"')
    story.expect_success(lines.TASK_DETAILS, "state: cancelled")
    story.expect_rows(story.error_log_text().count("listener samples.failing-worker-notice") == 3 * 2)
