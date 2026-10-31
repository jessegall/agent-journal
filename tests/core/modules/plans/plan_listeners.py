from tests.core.modules.tasks.task_lifecycle import started_story

PROTECTED_TASKS = "tests.core.modules.plans.samples:ProtectedTasksModule"


def plan_with_placed_tasks(new_story, *titles: str, modules: tuple[str, ...] = ()):
    story = started_story(lambda: new_story(*modules))
    story.run('plan make "Version 5 core" --environment main')
    story.run('phase make --plan 1 "Everything"')
    for task_id, title in enumerate(titles, 1):
        story.run(f'task make "{title}" --environment main')
        story.run(f"phase place {task_id} --phase 1")
    return story


def test_cancelling_a_plan_cancels_its_open_tasks_in_the_same_transaction(new_story):
    story = plan_with_placed_tasks(new_story, "First", "Second")
    story.expect_success('plan cancel 1 --reason "replaced"', "state: cancelled")
    story.expect_success("task show 1", "state: cancelled", "reason: plan 1 was cancelled")
    story.expect_success("task show 2", "state: cancelled")


def test_a_refused_task_cancel_undoes_the_whole_plan_cancel(new_story):
    story = plan_with_placed_tasks(new_story, "First", "Keep", modules=(PROTECTED_TASKS,))
    story.expect_refusal('plan cancel 1 --reason "replaced"', "refused by samples.protected-task: a task titled Keep is never cancelled")
    story.expect_success("plan show 1", "state: draft")
    story.expect_success("task show 1", "state: open")


def test_closing_a_task_of_a_started_plan_starts_the_next_for_the_same_agent(new_story):
    story = plan_with_placed_tasks(new_story, "First", "Second")
    for move in ("ready", "approve", "start"):
        story.run(f"plan {move} 1")
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_success("task show 2", "state: started", f"holder_id: {story.agent.id}")


def test_a_commit_listener_that_fails_three_times_is_skipped_and_the_cancel_stands(new_story):
    story = plan_with_placed_tasks(new_story, "First", modules=("tests.core.modules.plans.samples:FailingNoticeModule",))
    story.expect_success('plan cancel 1 --reason "replaced"', "state: cancelled")
    for _ in range(4):
        story.run("task show 1")
    story.expect_success("task show 1", "state: cancelled")
    story.expect_rows(story.error_log_text().count("listener samples.failing-worker-notice") == 3)
