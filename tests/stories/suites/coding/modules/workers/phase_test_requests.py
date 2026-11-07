import pytest

from core.base.driver.command_category import CommandCategory
from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from core.base.driver.block_until import BlockUntil
from core.base.driver.conditions.ran_command import RanCommand
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.testing.expect_reply import expect_reply_allowed, expect_reply_refusal
from core.testing.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_ALIAS, TEST_LINE, RunRequest, asking_main, shell_test_part, worker_on_plan

WHY = "the rounding only shows in a real run"
SECOND_REASON = "the totals only show in a real run"
FLAG = "--ask-main"
ALLOW = "worker allow-test 1"
REQUESTED = RunRequest(1, TEST_LINE, WHY, "requested")


@pytest.fixture
def on_plan(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    worker.story.expect_success("setting set journal.suites.coding.workers.worker-phase-test-runs 0 --environment main", actor=worker.story.user)
    return worker


@pytest.fixture
def alias_saved(on_plan):
    on_plan.save_test_alias()
    return on_plan


@pytest.fixture
def requested(on_plan):
    on_plan.run_test(asking_main(TEST_LINE, WHY))
    return on_plan


@pytest.fixture
def allowed(requested):
    requested.story.run(ALLOW, actor=requested.story.agent)
    return requested


def expect_requests(worker, *requests: RunRequest) -> None:
    rows = worker.run_requests()
    assert rows == requests, rows


def test_a_flagged_run_does_not_run_and_sends_one_request(on_plan):
    reply = on_plan.run_test(asking_main(TEST_LINE, WHY))
    expect_reply_refusal(reply, "main agent")
    expect_requests(on_plan, REQUESTED)
    on_plan.story.expect_rows(all(TEST_LINE not in line and WHY not in line for line in on_plan.main_agent_lines()))
    on_plan.story.expect_text("worker-test-request show 1", TEST_LINE, WHY, actor=on_plan.story.agent)


@pytest.mark.parametrize("flagged", [f'{TEST_LINE} {FLAG} ""', f"{TEST_LINE} {FLAG}"])
def test_the_flag_with_no_reason_is_refused_and_sends_nothing(on_plan, flagged):
    expect_reply_refusal(on_plan.run_test(flagged), "reason")
    expect_requests(on_plan)
    on_plan.story.expect_rows(on_plan.main_agent_lines() == ())


def test_the_same_command_flagged_again_sends_nothing_more_and_names_the_same_request(requested):
    expect_reply_refusal(requested.run_test(asking_main(TEST_LINE, SECOND_REASON)), "request 1")
    expect_requests(requested, REQUESTED)
    requested.story.expect_rows(len(requested.main_agent_lines()) == 1)


def test_a_different_command_sends_its_own_request(requested):
    expect_reply_refusal(requested.run_test(asking_main(SECOND_TEST_LINE, SECOND_REASON)), "main agent")
    expect_requests(requested, REQUESTED, RunRequest(2, SECOND_TEST_LINE, SECOND_REASON, "requested"))


def test_the_flag_with_an_equals_sign_names_the_same_request(requested):
    expect_reply_refusal(requested.run_test(f'{TEST_LINE} {FLAG}="{WHY}"'), "request 1")
    expect_requests(requested, REQUESTED)


def test_an_allowed_command_written_with_other_spacing_and_quoting_is_the_same_command(allowed):
    expect_reply_allowed(allowed.run_test('pytest   "tests/cart.py"'))
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))


def test_a_saved_alias_allowed_through_a_journal_line_runs_with_a_reading_flag(alias_saved):
    alias_saved.run_line(f'journal {TEST_ALIAS} {FLAG} "{WHY}"', ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, FLAG, WHY]))
    alias_saved.story.expect_success(ALLOW, actor=alias_saved.story.agent)
    expect_reply_allowed(alias_saved.run_line(f"journal {TEST_ALIAS} --tail 20", ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, "--tail", "20"])))
    expect_requests(alias_saved, RunRequest(1, f"journal {TEST_ALIAS}", WHY, "used"))


def test_a_line_with_two_flagged_parts_sends_a_request_for_each(on_plan):
    on_plan.run_test(f"{asking_main(TEST_LINE, WHY)} && {asking_main(SECOND_TEST_LINE, SECOND_REASON)}")
    expect_requests(on_plan, REQUESTED, RunRequest(2, SECOND_TEST_LINE, SECOND_REASON, "requested"))


def test_a_flagged_saved_test_alias_sends_one_request(alias_saved):
    expect_reply_refusal(alias_saved.run_saved_test(asking_main(TEST_LINE, WHY)), "main agent")
    expect_requests(alias_saved, REQUESTED)


def test_an_allowed_request_tells_the_worker_and_that_command_runs_once(requested):
    requested.story.expect_success(ALLOW, actor=requested.story.agent)
    requested.story.expect_rows(any("request 1 is allowed" in line for line in requested.worker_lines()))
    expect_reply_allowed(requested.run_test())
    expect_requests(requested, RunRequest(1, TEST_LINE, WHY, "used"))


def test_a_second_run_of_an_allowed_command_is_refused_again(allowed):
    expect_reply_allowed(allowed.run_test())
    expect_reply_refusal(allowed.run_test(), FLAG)


def test_the_same_program_with_other_arguments_is_refused_after_an_allowed_request(allowed):
    expect_reply_refusal(allowed.run_test(SECOND_TEST_LINE), FLAG)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))


def test_the_flag_on_an_allowed_command_is_refused_and_says_to_run_it_without_the_flag(allowed):
    expect_reply_refusal(allowed.run_test(asking_main(TEST_LINE, WHY)), "without the flag")
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))


def test_an_allowed_run_never_used_does_not_carry_over_to_the_next_task(allowed):
    allowed.change_and_prove()
    allowed.story.expect_success("worker next --wait --differences none", actor=allowed.worker)
    allowed.story.expect_rows(allowed.current_task() == 2)
    expect_reply_refusal(allowed.run_test(), FLAG)


def test_the_main_agent_reads_the_command_and_reason_from_the_request(on_plan):
    on_plan.run_test(asking_main(TEST_LINE, WHY))
    lines = on_plan.main_agent_lines()
    on_plan.story.expect_rows(len(lines) == 1)
    on_plan.story.expect_rows("request:1" in lines[0], TEST_LINE not in lines[0], WHY not in lines[0])
    on_plan.story.expect_text("worker-test-request show 1", TEST_LINE, WHY, actor=on_plan.story.agent)


def test_a_worker_cannot_allow_its_own_request(requested):
    requested.story.expect_refusal(ALLOW, "main agent", actor=requested.worker)
    expect_requests(requested, REQUESTED)


def test_a_worker_cannot_allow_the_request_of_another_worker(requested):
    task_id = requested.story.new_row_id('task make "Docs" --brief "The docs"', actor=requested.story.agent)
    second_worker = dispatched_worker(requested.story, f"worker dispatch --model sonnet {task_id}")
    requested.story.expect_refusal(ALLOW, "main agent", actor=second_worker)
    expect_requests(requested, REQUESTED)


def test_allowing_a_request_twice_is_refused_and_says_so(requested):
    requested.story.expect_success(ALLOW, actor=requested.story.agent)
    requested.story.expect_refusal(ALLOW, "already", actor=requested.story.agent)


def test_allowing_a_used_request_is_refused_and_says_so(allowed):
    expect_reply_allowed(allowed.run_test())
    allowed.story.expect_refusal(ALLOW, "already", actor=allowed.story.agent)


def test_with_no_answer_the_worker_goes_on_and_the_request_stays_on_the_task_log(requested):
    requested.story.expect_text("task inspect 1 --json", TEST_LINE, WHY, actor=requested.story.agent)
    requested.change_and_prove()
    requested.story.expect_success("worker next --wait --differences none", actor=requested.worker)
    requested.story.expect_rows(requested.current_task() == 2)
    expect_requests(requested, REQUESTED)
    requested.story.expect_text("task inspect 1 --json", TEST_LINE, WHY, actor=requested.story.agent)


def test_a_person_is_never_asked_about_a_request(requested):
    expect_requests(requested, REQUESTED)
    requested.story.expect_no_text("question list", TEST_LINE, actor=requested.story.user)
    requested.story.expect_no_text("message list --json", TEST_LINE, actor=requested.story.user)


def test_each_step_of_a_request_is_on_the_task_log(allowed):
    expect_reply_allowed(allowed.run_test())
    allowed.story.expect_text("task inspect 1 --json", TEST_LINE, WHY, "allowed the run of request 1", "ran request 1", actor=allowed.story.agent)


def test_an_allowed_saved_run_with_no_read_flag_is_refused_and_keeps_its_permission(allowed):
    allowed.save_test_alias()
    expect_reply_refusal(allowed.run_saved_test(read_flag=""), "--tail")
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))
    allowed.run_saved_test()
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))


def test_an_allowed_request_runs_once_as_pytest_as_python_dash_m_and_as_its_saved_command(alias_saved):
    module_form = f"python3 -m {TEST_LINE}"
    alias_form = (f"journal {TEST_ALIAS} --tail 20", ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, "--tail", "20"]))
    runs = (lambda: alias_saved.run_test(TEST_LINE), lambda: alias_saved.run_test(module_form), lambda: alias_saved.run_line(*alias_form))
    for number, run in enumerate(runs, 1):
        alias_saved.run_test(asking_main(TEST_LINE, WHY))
        alias_saved.story.expect_success(f"worker allow-test {number}", actor=alias_saved.story.agent)
        expect_reply_allowed(run())
    expect_requests(alias_saved, *(RunRequest(number, TEST_LINE, WHY, "used") for number in (1, 2, 3)))


def test_a_request_asked_through_the_saved_command_is_allowed_for_pytest_and_python_dash_m(alias_saved):
    alias_saved.run_line(f'journal {TEST_ALIAS} {FLAG} "{WHY}"', ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, FLAG, WHY]))
    alias_saved.story.expect_success(ALLOW, actor=alias_saved.story.agent)
    expect_reply_allowed(alias_saved.run_test(f"python3 -m {TEST_LINE}"))
    expect_requests(alias_saved, RunRequest(1, f"journal {TEST_ALIAS}", WHY, "used"))


def test_a_line_refused_by_another_rule_does_not_use_up_an_allowed_run(allowed):
    refusal_text = "read the task first"
    allowed.story.container.get(Bus).run(BlockUntil(allowed.worker.id, Nudge("workers.refusal", NudgeType.REFUSAL, refusal_text), RanCommand("journal overview")), Actor.core())
    expect_reply_refusal(allowed.run_test(), refusal_text)
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "allowed"))
    allowed.run_line("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))
    expect_reply_allowed(allowed.run_test())
    expect_requests(allowed, RunRequest(1, TEST_LINE, WHY, "used"))
    expect_reply_refusal(allowed.run_test(), FLAG)


def test_a_test_request_and_approval_show_marks_for_the_worker(requested):
    story = requested.story
    story.run_listeners()
    marks = story.container.get(Queries).query(ChatMark)
    request = marks.filter(variant=WorkerMarkVariant.TEST_REQUEST).first()
    story.expect_rows(request is not None, request.target_model == "agents", request.target_id == requested.worker.id,
                      TEST_LINE in request.detail, WHY in request.detail, "asks to run a test" in request.text)
    story.expect_success(ALLOW, actor=story.agent)
    story.run_listeners()
    allowed = marks.filter(variant=WorkerMarkVariant.TEST_ALLOWED).first()
    story.expect_rows(allowed is not None, allowed.target_id == requested.worker.id, TEST_LINE in allowed.detail,
                      WHY in allowed.detail, "may run the test" in allowed.text)
