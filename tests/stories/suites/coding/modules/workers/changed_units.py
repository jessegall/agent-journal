from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly
from tests.stories.suites.coding.modules.workers.support.phase_steps import start_planned_worker, unplanned_group_worker
from tests.stories.suites.coding.modules.workers.work_units import plan_card, unit_of

"""A unit that cannot finish, and a user who changes it mid-way."""


def test_a_task_cancelled_out_of_a_unit_lets_the_rest_finish(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2))
    worker.story.expect_success('task cancel 3 --reason "not needed"', actor=worker.story.user)
    worker.end_all_tests()
    worker.story.expect_rows(unit_of(worker).task_ids == (1, 2), "Point: merge_due" in worker.status(), detail=worker.status())


def test_a_plan_given_to_another_agent_mid_unit_leaves_the_worker_its_committed_tasks(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, tuple([1]))
    worker.story.expect_success("plan assign 1 --environment main", actor=worker.story.user)
    card = plan_card(worker)
    worker.story.expect_rows(card["assignee"] is None or card["assignee"]["id"] != worker.worker.id, 1 in unit_of(worker).task_ids, detail=f"{card} / {unit_of(worker)}")


def test_a_release_while_an_ask_waits_is_refused(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_tasks_singly(worker, (1, 2, 3))
    worker.end_all_tests()
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    number = agent_number(worker.story, worker.worker.id)
    outcome = worker.story.run(f'worker release {number} "not needed"', actor=worker.story.agent)
    worker.story.expect_text("merge-ask show 1 --environment main", "state:", actor=worker.story.agent)
    worker.story.expect_rows(outcome.code == 0 or "committed work" in outcome.output_text, detail=outcome.output_text)


def test_a_worker_that_ended_still_names_its_plan(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.program_ended()
    worker.story.expect_rows(plan_card(worker)["assignee"]["id"] == worker.worker.id, detail=str(plan_card(worker)))
