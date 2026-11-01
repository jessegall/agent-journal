from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import BYTES_SHORT, start_process
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

TESTS = HookSamples.shell("pytest -q", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"]))
LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def worker_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    return story, worker_session(story, dispatched_worker(story))


def test_a_worker_may_run_its_tests_when_no_other_run_goes(new_story):
    story, session = worker_story(new_story)
    assert "only one test run" not in story.hook(session, TESTS).refusal


def test_a_workers_run_is_refused_while_another_goes_and_names_it(new_story):
    story, session = worker_story(new_story)
    start_process(story, "pytest -q", category=CommandCategory.TEST_RUN)
    story.expect_hook_refusal(session, TESTS, "only one test run goes at a time, and process 1 of agent")
    story.expect_hook_refusal(session, TESTS, ".journal/processes/1/end")


def test_the_turn_is_free_once_the_other_run_ended(new_story):
    story, session = worker_story(new_story)
    process = start_process(story, "pytest -q", category=CommandCategory.TEST_RUN)
    story.expect_hook_refusal(session, TESTS, "only one test run")
    story.container.get(Bus).run(EndProcess(process.id, 0, BYTES_SHORT, 1), story.agent, environment_id=1)
    assert "only one test run" not in story.hook(session, TESTS).refusal


def test_another_kind_of_command_is_not_held(new_story):
    story, session = worker_story(new_story)
    start_process(story, "pytest -q", category=CommandCategory.TEST_RUN)
    assert "only one test run" not in story.hook(session, LISTING).refusal


def test_the_main_agent_is_not_held(new_story):
    story, session = worker_story(new_story)
    start_process(story, "pytest -q", category=CommandCategory.TEST_RUN)
    assert "only one test run" not in story.hook("s-1", TESTS).refusal


def test_a_test_run_behind_an_alias_that_declares_it_holds_the_turn_both_ways(new_story):
    story, session = worker_story(new_story)
    story.expect_success('alias add checks-run "pytest -q" --workers --category "test run"', 'alias checks-run added: journal checks-run [args] runs pytest -q', actor=story.agent)
    story.expect_text("alias show 1", "category: test run", actor=story.agent)
    aliased = HookSamples.shell("journal checks-run", ShellPart("journal", CommandCategory.JOURNAL, ["checks-run"]))
    start_process(story, "pytest -q", category=CommandCategory.TEST_RUN)
    story.expect_hook_refusal(session, aliased, "only one test run goes at a time")
    story.expect_hook_refusal(session, TESTS, "only one test run goes at a time")
