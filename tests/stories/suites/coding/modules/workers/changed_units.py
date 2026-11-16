from tests.stories.suites.coding.modules.workers.free_commits import three_committed_worker, two_committed_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.phase_steps import group_worker, planned_worker  # noqa: F401
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE, commit_tasks_singly
from tests.integration.suites.coding.modules.workers.test_work_units import plan_card, worker_unit

"""A unit that cannot finish, and a user who changes it mid-way."""


def test_a_task_cancelled_out_of_a_unit_lets_the_rest_finish(two_committed_worker):
    two_committed_worker.story.expect_success('task cancel 3 --reason "not needed"', actor=two_committed_worker.story.user)
    two_committed_worker.end_all_tests()
    two_committed_worker.story.expect_rows(worker_unit(two_committed_worker).task_ids == (1, 2), "Point: merge_due" in two_committed_worker.status(), detail=two_committed_worker.status())


def test_a_plan_given_to_another_agent_mid_unit_leaves_the_worker_its_committed_tasks(planned_worker):
    commit_tasks_singly(planned_worker, (1,))
    planned_worker.story.expect_success("plan assign 1 --environment main", actor=planned_worker.story.user)
    card = plan_card(planned_worker)
    planned_worker.story.expect_rows(card["assignee"] is None or card["assignee"]["id"] != planned_worker.worker.id, 1 in worker_unit(planned_worker).task_ids, detail=f"{card} / {worker_unit(planned_worker)}")


def test_a_release_while_an_ask_waits_is_refused(three_committed_worker):
    three_committed_worker.end_all_tests()
    three_committed_worker.story.expect_success(REQUEST_MERGE, actor=three_committed_worker.worker)
    number = agent_number(three_committed_worker.story, three_committed_worker.worker.id)
    outcome = three_committed_worker.story.run(f'worker release {number} "not needed"', actor=three_committed_worker.story.agent)
    three_committed_worker.story.expect_text("merge-ask show 1 --environment main", "state:", actor=three_committed_worker.story.agent)
    three_committed_worker.story.expect_rows(outcome.code == 0 or "committed work" in outcome.output_text, detail=outcome.output_text)


def test_a_worker_that_ended_still_names_its_plan(planned_worker):
    planned_worker.program_ended()
    planned_worker.story.expect_rows(plan_card(planned_worker)["assignee"]["id"] == planned_worker.worker.id, detail=str(plan_card(planned_worker)))
