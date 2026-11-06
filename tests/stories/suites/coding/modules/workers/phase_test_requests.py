import pytest

from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import OTHER_TEST_LINE, TEST_LINE, RunRequest, asking_main, worker_on_plan

WHY = "the rounding only shows in a real run"
OTHER_WHY = "the totals only show in a real run"
FLAG = "--ask-main"
ALLOW = "worker allow-test 1"
ASKED = RunRequest(1, TEST_LINE, WHY, "asked")


@pytest.fixture
def on_plan(new_story, monkeypatch):
    return worker_on_plan(new_story, monkeypatch)


@pytest.fixture
def asked(on_plan):
    on_plan.run_test(asking_main(TEST_LINE, WHY))
    return on_plan


@pytest.fixture
def allowed(asked):
    asked.story.run(ALLOW, actor=asked.story.agent)
    return asked


def expect_requests(worker, *requests: RunRequest) -> None:
    rows = worker.run_requests()
    assert rows == requests, rows


def test_a_flagged_run_does_not_run_and_sends_one_request(on_plan):
    reply = on_plan.run_test(asking_main(TEST_LINE, WHY))
    expect_reply_refusal(reply, "request 1")
    expect_requests(on_plan, ASKED)


@pytest.mark.parametrize("flagged", [f'{TEST_LINE} {FLAG} ""', f"{TEST_LINE} {FLAG}"])
def test_the_flag_with_no_reason_is_refused_and_sends_nothing(on_plan, flagged):
    expect_reply_refusal(on_plan.run_test(flagged), "reason")
    expect_requests(on_plan)
    assert on_plan.main_agent_lines() == ()


def test_the_same_command_flagged_again_sends_nothing_more_and_names_the_same_request(asked):
    expect_reply_refusal(asked.run_test(asking_main(TEST_LINE, OTHER_WHY)), "request 1")
    expect_requests(asked, ASKED)
    assert len(asked.main_agent_lines()) == 1


def test_a_different_command_sends_its_own_request(asked):
    expect_reply_refusal(asked.run_test(asking_main(OTHER_TEST_LINE, OTHER_WHY)), "request 2")
    expect_requests(asked, ASKED, RunRequest(2, OTHER_TEST_LINE, OTHER_WHY, "asked"))


def test_a_line_with_two_flagged_parts_sends_a_request_for_each(on_plan):
    on_plan.run_test(f"{asking_main(TEST_LINE, WHY)} && {asking_main(OTHER_TEST_LINE, OTHER_WHY)}")
    expect_requests(on_plan, ASKED, RunRequest(2, OTHER_TEST_LINE, OTHER_WHY, "asked"))


def test_a_flagged_saved_test_alias_sends_one_request(on_plan):
    on_plan.save_test_alias()
    expect_reply_refusal(on_plan.run_saved_test(asking_main(TEST_LINE, WHY)), "request 1")
    expect_requests(on_plan, ASKED)


def test_an_allowed_request_tells_the_worker_and_that_command_runs_once(asked):
    asked.story.expect_success(ALLOW, actor=asked.story.agent)
    assert any("request 1" in line and TEST_LINE in line for line in asked.worker_lines()), asked.worker_lines()
    expect_reply_allowed(asked.run_test())
    expect_requests(asked, RunRequest(1, TEST_LINE, WHY, "used"))


def test_a_second_run_of_an_allowed_command_is_refused_again(allowed):
    expect_reply_allowed(allowed.run_test())
    expect_reply_refusal(allowed.run_test(), FLAG)


def test_the_same_program_with_other_arguments_is_refused_after_an_allowed_request(allowed):
    expect_reply_refusal(allowed.run_test(OTHER_TEST_LINE), FLAG)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))


def test_the_flag_on_an_allowed_command_is_refused_and_says_to_run_it_without_the_flag(allowed):
    expect_reply_refusal(allowed.run_test(asking_main(TEST_LINE, WHY)), "without the flag")
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))


def test_an_allowed_run_never_used_does_not_carry_over_to_the_next_task(allowed):
    allowed.change_and_prove()
    allowed.story.expect_success("worker next", actor=allowed.worker)
    assert allowed.current_task() == 2
    expect_reply_refusal(allowed.run_test(), FLAG)


def test_the_main_agent_gets_one_line_with_the_exact_command_the_reason_and_the_way_to_allow(on_plan):
    on_plan.run_test(asking_main(TEST_LINE, WHY))
    lines = on_plan.main_agent_lines()
    assert len(lines) == 1, lines
    assert TEST_LINE in lines[0] and WHY in lines[0] and ALLOW in lines[0] and FLAG not in lines[0], lines


def test_a_worker_cannot_allow_its_own_request(asked):
    asked.story.expect_refusal(ALLOW, "main agent", actor=asked.worker)
    expect_requests(asked, ASKED)


def test_a_worker_cannot_allow_the_request_of_another_worker(asked):
    task_id = asked.story.new_row_id('task make "Docs" --brief "The docs"', actor=asked.story.agent)
    other_worker = dispatched_worker(asked.story, f"worker dispatch --model sonnet {task_id}")
    asked.story.expect_refusal(ALLOW, "main agent", actor=other_worker)
    expect_requests(asked, ASKED)


def test_allowing_a_request_twice_is_refused_and_says_so(asked):
    asked.story.expect_success(ALLOW, actor=asked.story.agent)
    asked.story.expect_refusal(ALLOW, "already", actor=asked.story.agent)


def test_allowing_a_used_request_is_refused_and_says_so(allowed):
    expect_reply_allowed(allowed.run_test())
    allowed.story.expect_refusal(ALLOW, "already", actor=allowed.story.agent)


def test_with_no_answer_the_worker_goes_on_and_the_request_stays_on_the_task_log(asked):
    asked.story.expect_text("task inspect 1", TEST_LINE, WHY, actor=asked.story.agent)
    asked.change_and_prove()
    asked.story.expect_success("worker next", actor=asked.worker)
    assert asked.current_task() == 2
    expect_requests(asked, ASKED)
    asked.story.expect_text("task inspect 1", TEST_LINE, WHY, actor=asked.story.agent)


def test_a_person_is_never_asked_about_a_request(asked):
    expect_requests(asked, ASKED)
    asked.story.expect_no_text("question list", TEST_LINE, actor=asked.story.user)
    asked.story.expect_no_text("message list --json", TEST_LINE, actor=asked.story.user)


def test_each_step_of_a_request_is_on_the_task_log(allowed):
    expect_reply_allowed(allowed.run_test())
    allowed.story.expect_text("task inspect 1", TEST_LINE, WHY, "allowed the run of request 1", "ran request 1", actor=allowed.story.agent)
