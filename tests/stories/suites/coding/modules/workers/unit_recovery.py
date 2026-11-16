from tests.stories.suites.coding.modules.workers.merge_asks import committed_worker, running_plan_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.phase_steps import group_worker, planned_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.free_commits import worktree_state
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, repository_environment
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly

"""Book G of doc 1252: interruption and recovery; nothing committed is lost and someone is told at every stop."""


def test_79_a_crashed_worker_resumes_with_its_unit(planned_worker):
    commit_tasks_singly(planned_worker, (1,))
    planned_worker.program_ended()
    planned_worker.story.expect_rows(planned_worker.status().splitlines()[1].startswith("Unit: plan 1"), detail=planned_worker.status())


def test_80_the_journal_restarts_during_a_worker_run(running_plan_worker):
    running_plan_worker.program_ended()
    running_plan_worker.story.expect_rows(len(running_plan_worker.started) > 0, detail=running_plan_worker.status())


def test_81_a_release_with_committed_work_is_refused(group_worker):
    commit_tasks_singly(group_worker, (1,))
    number = group_worker.worker.id
    group_worker.story.expect_refusal(f'worker release {number} "not needed"', f"worker {number} has committed work", actor=group_worker.story.agent)
    group_worker.story.expect_success(f'worker release {number} --abandon "the cart is dropped"', actor=group_worker.story.agent)


def test_82_an_ask_that_waits_long_is_shown_as_unmerged_work(committed_worker):
    committed_worker.story.expect_success(REQUEST_MERGE, actor=committed_worker.worker)
    committed_worker.story.expect_rows(worktree_state(committed_worker) == "delivered", detail=committed_worker.status())


def test_83_a_worker_idle_at_merge_due_is_told_its_line(committed_worker):
    committed_worker.story.expect_rows("journal worker ask-merge" in committed_worker.status_line(), detail=committed_worker.status())


def test_a_release_of_a_delivered_worker_with_an_uncommitted_file_is_refused_until_abandon(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    number = worker.id
    repository.changed(worker.id, "fix_notes.txt", "edited after the return")
    story.expect_refusal(f'worker release {number} "not needed"', f"worker {number} has uncommitted files", actor=story.agent)
    story.expect_success(f'worker release {number} --abandon "the fix is dropped"', actor=story.agent)
