import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.expect_reply import expect_reply_allowed, expect_reply_line, expect_reply_refusal
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_RUN_ALLOWED
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_ALIAS, TEST_LINE, asking_main, start_planned_worker

SETTING = "journal.suites.coding.workers.worker-phase-test-runs"


@pytest.fixture
def worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch)


def expect_counted(worker, remaining):
    reply = worker.run_test()
    expect_reply_allowed(reply)
    expect_reply_line(reply, PHASE_TEST_RUN_ALLOWED.nudge(remaining=remaining).text)


@pytest.fixture
def spent(worker):
    for remaining in (2, 1, 0):
        expect_counted(worker, remaining)
    return worker


def test_three_runs_count_down_and_the_fourth_is_refused_with_the_hand_in_reason(spent):
    expect_reply_refusal(spent.run_test(), "--ask-main")
    expect_reply_refusal(spent.run_test(), "returns failures")
    spent.story.expect_rows(spent.main_agent_lines() == ())


@pytest.fixture
def moved(spent):
    spent.prove_advance()
    return spent


def test_the_same_phase_keeps_its_count_when_the_worker_moves_to_another_task(moved):
    expect_reply_refusal(moved.run_test(), "--ask-main")


def test_the_next_phase_starts_a_new_count(moved):
    for _ in range(2):
        moved.prove_advance()
    moved.story.expect_rows(moved.current_task() == 4)
    expect_counted(moved, 2)


def test_an_allowed_request_does_not_spend_the_phase_allowance(spent):
    expect_reply_refusal(spent.run_test(asking_main(TEST_LINE, "a real run is needed")), "main agent")
    spent.story.expect_success("worker allow-test 1", actor=spent.story.user)
    spent.story.expect_success(f"setting set {SETTING} 4 --environment main", actor=spent.story.user)
    expect_reply_allowed(spent.run_test())
    expect_counted(spent, 0)
    expect_reply_refusal(spent.run_test(), "--ask-main")


def test_another_worker_in_the_same_phase_has_its_own_count(new_story, monkeypatch):
    first = start_planned_worker(new_story, monkeypatch, dispatch="worker dispatch --model sonnet 1")
    for remaining in (2, 1, 0):
        expect_counted(first, remaining)
    second_worker = first.added_worker("worker dispatch --model sonnet 2")
    expect_counted(second_worker, 2)


def test_only_a_person_can_change_the_allowance(worker):
    worker.story.expect_refusal(f"setting set {SETTING} 1 --environment main", "person", actor=worker.worker)
    worker.story.expect_success(f"setting set {SETTING} 1 --environment main", actor=worker.story.user)
    expect_counted(worker, 0)
    expect_reply_refusal(worker.run_test(), "--ask-main")


def test_asking_before_the_allowance_is_spent_sends_no_request(worker):
    expect_reply_refusal(worker.run_test(asking_main(TEST_LINE, "a real run is needed")), "need not ask")
    worker.story.expect_rows(worker.run_requests() == ())
    expect_counted(worker, 2)


def test_test_parts_in_one_shell_line_each_use_a_run_and_a_refused_line_spends_none(worker):
    reply = worker.run_test(" && ".join([TEST_LINE] * 4))
    expect_reply_refusal(reply, "--ask-main")
    expect_counted(worker, 2)
    expect_reply_allowed(worker.run_test(f"{TEST_LINE} && {TEST_LINE}"))
    expect_reply_refusal(worker.run_test(), "--ask-main")


def test_saved_aliases_use_the_same_allowance(worker):
    worker.save_test_alias()
    for _ in range(3):
        expect_reply_allowed(worker.run_line(f"journal {TEST_ALIAS} --tail 20", ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, "--tail", "20"])))
    expect_reply_refusal(worker.run_saved_test(), "--ask-main")


def test_help_and_collection_do_not_use_the_allowance(worker):
    expect_reply_allowed(worker.run_test(f"{TEST_LINE} --help"))
    expect_reply_allowed(worker.run_test(f"{TEST_LINE} --collect-only"))
    expect_counted(worker, 2)


def test_another_rules_refusal_does_not_spend_a_run(worker):
    expect_reply_refusal(worker.run_test_with_saved_commands_known(), "alias")
    expect_counted(worker, 2)
