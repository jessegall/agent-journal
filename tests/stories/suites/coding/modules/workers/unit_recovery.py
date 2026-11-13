from tests.stories.suites.coding.modules.workers.free_commits import worktree_state
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.free_commits import ASK_MERGE, commit_each
from tests.stories.suites.coding.modules.workers.merge_asks import committed_list, running_plan
from tests.stories.suites.coding.modules.workers.support.phase_steps import start_planned_worker, unplanned_group_worker

"""Book G of doc 1252: interruption and recovery; nothing committed is lost and someone is told at every stop."""


def test_79_a_crashed_worker_resumes_with_its_unit(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    commit_each(worker, tuple([1]))
    worker.program_ended()
    worker.story.expect_rows(worker.status().splitlines()[1].startswith("Unit: plan 1"), detail=worker.status())


def test_80_the_journal_restarts_during_a_worker_run(new_story, monkeypatch):
    worker = running_plan(new_story, monkeypatch)
    worker.program_ended()
    worker.story.expect_rows(len(worker.started) > 0, detail=worker.status())


def test_81_a_release_with_committed_work_is_refused(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, tuple([1]))
    number = agent_number(worker.story, worker.worker.id)
    worker.story.expect_refusal(f'worker release {number} "not needed"', f"worker {number} has committed work", actor=worker.story.agent)
    worker.story.expect_success(f'worker release {number} --abandon "the cart is dropped"', actor=worker.story.agent)


def test_82_an_ask_that_waits_long_is_shown_as_unmerged_work(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_success(ASK_MERGE, actor=worker.worker)
    worker.story.expect_rows(worktree_state(worker) == "delivered", detail=worker.status())


def test_83_a_worker_idle_at_merge_due_is_told_its_line(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_rows("journal worker ask-merge" in worker.status_line(), detail=worker.status())
