import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.expect_reply import expect_absent_reply_refusal, expect_reply_allowed, expect_reply_refusal
from core.testing.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_ALIAS, TEST_LINE, asking_main, shell_test_part, worker_on_plan, worker_outside_plan

FLAG = "--ask-main"
RULE = "workers.phase-tests"


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
def outside_plan(new_story, monkeypatch):
    return worker_outside_plan(new_story, monkeypatch)


def expect_main_agent_lines_absent(worker) -> None:
    lines = worker.main_agent_lines()
    assert lines == (), lines


def test_a_test_run_on_a_started_plan_is_refused_naming_the_flag_and_sends_nothing(on_plan):
    expect_reply_refusal(on_plan.run_test(), FLAG)
    expect_main_agent_lines_absent(on_plan)


def test_a_saved_test_alias_is_refused_as_a_test_line_is(alias_saved):
    expect_reply_refusal(alias_saved.run_saved_test(), FLAG)
    expect_main_agent_lines_absent(alias_saved)


def test_a_saved_test_alias_that_reaches_the_hook_as_a_journal_line_is_refused(alias_saved):
    reply = alias_saved.run_line(f"journal {TEST_ALIAS} --tail 20", ShellPart("journal", CommandCategory.JOURNAL, [TEST_ALIAS, "--tail", "20"]))
    expect_reply_refusal(reply, FLAG)


def test_the_worker_hears_the_flag_before_a_reader_request_holds_the_run(on_plan):
    on_plan.story.expect_success("setting set journal.core.processes.readers-forced on --environment main")
    expect_reply_refusal(on_plan.run_test(), FLAG)


def test_the_worker_hears_the_flag_before_the_rule_about_saved_commands(on_plan):
    expect_reply_refusal(on_plan.run_test_with_saved_commands_known(), FLAG)


def test_a_line_with_a_test_part_among_other_parts_is_refused_whole(on_plan):
    reply = on_plan.run_line(f"cat notes && {TEST_LINE}", ShellPart("cat", CommandCategory.READ, ["notes"]), shell_test_part(TEST_LINE))
    expect_reply_refusal(reply, FLAG)


@pytest.mark.parametrize("asking_flag", ["--help", "--collect-only"])
def test_a_run_that_runs_no_test_passes(on_plan, asking_flag):
    expect_reply_allowed(on_plan.run_test(f"{TEST_LINE} {asking_flag}"))


def test_the_refusal_names_the_flag_and_offers_no_refusal_skip(on_plan):
    reply = on_plan.run_test()
    expect_reply_refusal(reply, FLAG)
    expect_absent_reply_refusal(reply, "refusal skip")


def test_a_refusal_skip_does_not_pass_the_refusal(on_plan):
    on_plan.run_test()
    on_plan.story.expect_refusal(f'refusal skip {RULE} --reason "I need it" --environment main', "safety refusal", actor=on_plan.worker)
    expect_reply_refusal(on_plan.run_test(), FLAG)


@pytest.mark.parametrize("line,part", [("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])),
                                       ("make package", ShellPart("make", CommandCategory.BUILD, ["package"]))])
def test_a_read_or_a_build_passes_because_only_test_runs_are_held(on_plan, line, part):
    expect_reply_allowed(on_plan.run_line(line, part))


def test_outside_a_plan_a_test_run_goes_on_as_today(outside_plan):
    expect_reply_allowed(outside_plan.run_test())


@pytest.fixture
def proved_with_test(outside_plan):
    outside_plan.change_and_prove(TEST_LINE)
    return outside_plan


@pytest.fixture
def proved_without_test(outside_plan):
    outside_plan.change_and_prove()
    return outside_plan



def test_outside_a_plan_worker_next_queues_the_tests_of_that_task(proved_with_test):
    outside_plan = proved_with_test
    outside_plan.story.expect_text("worker next --wait --differences none", "the tests of task 1 are queued", actor=outside_plan.worker)
    outside_plan.story.expect_rows(len(outside_plan.started) == 1)


def test_outside_a_plan_a_proof_with_no_test_waits_on_the_main_agent(proved_without_test):
    outside_plan = proved_without_test
    outside_plan.story.run("worker next --wait --differences none", actor=outside_plan.worker)
    outside_plan.story.expect_text("proof show 1", "state: shown", actor=outside_plan.story.agent)


def test_outside_a_plan_the_flag_is_refused_with_no_need_to_ask(outside_plan):
    reply = outside_plan.run_test(asking_main(TEST_LINE, "the rounding only shows in a real run"))
    expect_reply_refusal(reply, "need not ask")


def test_the_main_agent_hears_nothing_while_a_worker_is_refused_and_works_through_a_phase(on_plan):
    on_plan.run_test()
    on_plan.change_and_prove()
    on_plan.story.expect_success("worker next --wait --differences none", actor=on_plan.worker)
    on_plan.story.expect_rows(on_plan.current_task() == 2)
    expect_main_agent_lines_absent(on_plan)
