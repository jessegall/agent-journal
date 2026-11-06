import pytest

from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from core.testing.hook_samples import HookSamples
from suites.coding.modules.workers.ticks.stalled_worker_tests import StalledWorkerTests
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_folder
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, TEST_LINE, asking_main, dispatched_story_worker, planned_story, worker_on_plan

FLAG = "--ask-main"
MAIN_SESSION = "s-1"
PLAN_STOPS = ['plan block 1 --reason "the supplier is late"', "plan cancel 1"]


@pytest.fixture
def on_plan(new_story, monkeypatch):
    return worker_on_plan(new_story, monkeypatch)


@pytest.fixture
def proved(on_plan):
    on_plan.prove()
    return on_plan


@pytest.fixture
def moved_past_a_test(on_plan):
    on_plan.prove_and_move_on(TEST_LINE)
    return on_plan


@pytest.fixture
def moved_past_no_test(on_plan):
    on_plan.prove_and_move_on()
    return on_plan


@pytest.fixture
def running_from_before(on_plan):
    on_plan.story.run('plan block 1 --reason "a pause"', actor=on_plan.story.agent)
    on_plan.prove_and_move_on(TEST_LINE)
    on_plan.story.run("plan unblock 1", actor=on_plan.story.agent)
    return on_plan


@pytest.fixture
def ended_from_before(running_from_before):
    running_from_before.end_all_tests()
    return running_from_before


@pytest.fixture
def clash_waiting(new_story, monkeypatch):
    story = planned_story(new_story)
    base = GitRepository(repository_folder(story))
    base.checkout(ENVIRONMENT_BRANCH)
    base.committed("tax.py", "TAX = 1\n", "The first tax")
    worker = dispatched_story_worker(story, PLAN_DISPATCH, monkeypatch)
    worker.prove()
    worker.repository.changed(worker.worker.id, "tax.py", "TAX = 5\n")
    base.committed("tax.py", "TAX = 21\n", "Another tax")
    return worker


@pytest.fixture
def outside_task_first(new_story, monkeypatch):
    story = planned_story(new_story)
    story.run('task make "Docs" --brief "The docs" --environment main', actor=story.agent)
    return dispatched_story_worker(story, "worker dispatch --model sonnet 5 1", monkeypatch)


@pytest.fixture
def plan_task_first(new_story, monkeypatch):
    story = planned_story(new_story)
    story.run('task make "Docs" --brief "The docs" --environment main', actor=story.agent)
    return dispatched_story_worker(story, "worker dispatch --model sonnet 1 5", monkeypatch)


def task_states_seen_by_the_person(worker) -> dict[int, str]:
    with server_story(worker.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        outline = server.viewer_line_value(cookie, {"window": "plans.plans", "line": ["plan", "outline", "1"], "environment": "main"})
    return {task["id"]: task["state"] for phase in outline["phases"] for task in phase["tasks"]}


def test_worker_next_inside_a_phase_commits_and_gives_the_next_task_with_nothing_run(proved):
    proved.story.expect_text("worker next", "task 2", actor=proved.worker)
    assert proved.current_task() == 2
    assert proved.started == [], proved.started
    proved.repository.expect_clean(proved.worker.id)
    proved.story.expect_text("task show 1", "state: testing", actor=proved.story.agent)


def test_worker_next_is_still_refused_for_a_point_with_no_proof(on_plan):
    on_plan.story.expect_refusal("worker next", "proof", actor=on_plan.worker)
    on_plan.story.expect_text("task show 2", "state: open", actor=on_plan.story.agent)


def test_a_proof_that_names_a_test_is_kept_and_runs_nothing_when_the_worker_moves_on(moved_past_a_test):
    moved_past_a_test.story.expect_text("proof show 1", "state: shown", f"test_command: {TEST_LINE}", actor=moved_past_a_test.story.agent)
    assert moved_past_a_test.started == [], moved_past_a_test.started


def test_worker_deliver_is_still_refused_while_a_task_is_queued(proved):
    proved.story.expect_refusal("worker deliver", "still in your queue", actor=proved.worker)


def test_a_clash_with_the_base_branch_stops_the_move(clash_waiting):
    clash_waiting.story.expect_refusal("worker next", "clashes", actor=clash_waiting.worker)
    clash_waiting.story.expect_text("task show 1", "state: started", actor=clash_waiting.story.agent)


def test_the_stalled_test_tick_does_not_start_the_proofs_of_a_task_moved_past(moved_past_a_test):
    StalledWorkerTests()(moved_past_a_test.story.container)
    assert moved_past_a_test.started == [], moved_past_a_test.started
    moved_past_a_test.story.expect_text("proof show 1", "state: shown", actor=moved_past_a_test.story.agent)


def test_a_test_already_running_ends_as_today_and_brings_the_next_task(running_from_before):
    running_from_before.end_all_tests()
    running_from_before.story.expect_text("task show 1", "state: completed", actor=running_from_before.story.agent)
    assert running_from_before.current_task() == 2


def test_the_task_after_a_running_test_follows_the_new_flow(ended_from_before):
    ended_from_before.prove_and_move_on()
    assert ended_from_before.current_task() == 3
    ended_from_before.story.expect_text("task show 2", "state: testing", actor=ended_from_before.story.agent)


def test_a_test_run_after_a_running_test_is_refused_with_a_line_that_says_what_to_do(ended_from_before):
    expect_reply_refusal(ended_from_before.run_test(), FLAG)


@pytest.mark.parametrize("plan_stop", PLAN_STOPS)
def test_on_a_stopped_plan_a_worker_runs_tests_as_today(moved_past_a_test, plan_stop):
    moved_past_a_test.story.run(plan_stop, actor=moved_past_a_test.story.agent)
    expect_reply_allowed(moved_past_a_test.run_test())


@pytest.mark.parametrize("plan_stop", PLAN_STOPS)
def test_on_a_stopped_plan_the_earlier_proofs_run_at_the_next_hand_in(moved_past_a_test, plan_stop):
    moved_past_a_test.story.run(plan_stop, actor=moved_past_a_test.story.agent)
    moved_past_a_test.prove_and_move_on()
    moved_past_a_test.story.expect_text("proof show 1", "state: running", actor=moved_past_a_test.story.agent)
    assert len(moved_past_a_test.started) == 1, moved_past_a_test.started


def test_a_task_outside_a_plan_and_then_a_task_of_a_plan_each_follow_their_own_flow(outside_task_first):
    expect_reply_allowed(outside_task_first.run_test())
    outside_task_first.change_and_prove(TEST_LINE)
    outside_task_first.story.expect_text("worker next", "queued", actor=outside_task_first.worker)
    outside_task_first.end_all_tests()
    assert outside_task_first.current_task() == 1
    expect_reply_refusal(outside_task_first.run_test(), FLAG)


def test_a_task_of_a_plan_and_then_a_task_outside_it_each_follow_their_own_flow(plan_task_first):
    expect_reply_refusal(plan_task_first.run_test(), FLAG)
    plan_task_first.change_and_prove(TEST_LINE)
    plan_task_first.story.expect_text("worker next", "queued", actor=plan_task_first.worker)
    plan_task_first.end_all_tests()
    assert plan_task_first.current_task() == 5
    expect_reply_allowed(plan_task_first.run_test())


def test_a_proof_with_no_test_on_a_phase_does_not_refuse_the_main_agents_stop(moved_past_no_test):
    moved_past_no_test.story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_proof_with_no_test_can_be_read_and_sent_back_which_gives_the_worker_the_failure_state(moved_past_no_test):
    moved_past_no_test.story.expect_text("proof show 1", "cart.py:1", actor=moved_past_no_test.story.agent)
    moved_past_no_test.story.expect_success('proof short 1 "the total is missing"', actor=moved_past_no_test.story.agent)
    expect_reply_allowed(moved_past_no_test.run_test())
    expect_reply_refusal(moved_past_no_test.run_test(asking_main(TEST_LINE, "the total")), "need not ask")


def test_a_person_sees_a_task_moved_past_as_testing(moved_past_no_test):
    states = task_states_seen_by_the_person(moved_past_no_test)
    assert (states[1], states[2]) == ("testing", "started"), states


def test_a_person_sees_the_tasks_of_a_phase_as_completed_once_its_tests_have_passed(on_plan):
    on_plan.prove_and_move_on(TEST_LINE)
    on_plan.prove_and_move_on()
    on_plan.prove_and_move_on()
    on_plan.end_all_tests()
    states = task_states_seen_by_the_person(on_plan)
    assert (states[1], states[2], states[3], states[4]) == ("completed", "completed", "completed", "started"), states
