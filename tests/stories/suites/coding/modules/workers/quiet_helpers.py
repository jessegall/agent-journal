from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory

from core.base.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.processes.support.process_samples import start_process
from suites.coding.modules.workers.rules.unstarted_worker_rule import START_SECONDS
from suites.coding.modules.workers.support.worker_settings import INACTIVE_HELPER_GRACE_MINUTES
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask, HelperUnderBuilder
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
GRACE_MINUTES = 15
REPEAT_MINUTES = 5
HELPER_PROMPT = HookSamples.prompt("Read the cart")


def minutes(count: int) -> timedelta:
    return timedelta(minutes=count)


def inactive_line(role: str, agent_id: int, count: int = GRACE_MINUTES) -> str:
    return f"{role}:{agent_id} has used no tool for {count} minutes"


def line_count(story, line: str) -> int:
    return story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line)


def idle_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    return story, worker


def test_the_inactive_line_names_the_commands_that_answer_it(new_story):
    story, worker = idle_worker(new_story)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"journal worker status {worker.id}")


def test_the_inactive_line_wakes_the_main_agent(new_story):
    story, worker = idle_worker(new_story)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    line = next(row for row in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if f"worker:{worker.id} has used no tool" in row.text)
    story.expect_rows(line.wakes_agent)


def test_a_worker_that_never_made_a_call_is_named_with_the_command_for_its_log_and_wakes_the_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(timedelta(seconds=START_SECONDS))
    story.tick(MAIN_SESSION)
    line = next(row for row in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if f"worker:{worker.id} made no call" in row.text)
    story.expect_rows(line.wakes_agent, f"worker:{worker.id} made no call" in line.text)


def test_a_worker_that_made_a_call_is_not_named_as_never_started(new_story):
    story, worker = idle_worker(new_story)
    story.hook(worker_session(story, worker), HookSamples.prompt("Fix the cart"))
    story.advance(timedelta(seconds=START_SECONDS))
    story.tick(MAIN_SESSION)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "made no call")


def test_the_inactive_line_of_a_worker_with_a_queued_run_says_so(new_story):
    story, worker = idle_worker(new_story)
    main = story.agent
    story.expect_success("setting set journal.core.processes.readers-forced off --environment main")
    story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    start_process(story, "make first", category=CommandCategory.TEST_RUN)
    start_process(story, "make second", category=CommandCategory.TEST_RUN)
    story.expect_success("setting set journal.core.processes.main-runs-take-slots on --environment main", actor=main)
    story.agent = worker
    process = start_process(story, "make third", category=CommandCategory.TEST_RUN)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {main.id}", f"run {process.id} waits, 2 ahead", f"journal worker status {worker.id}", actor=main)


def test_a_worker_that_has_used_no_tool_for_fifteen_minutes_is_named_to_its_main_agent_again_every_five_minutes(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.hook(worker_session(story, worker), HookSamples.prompt("Fix the cart"))
    line = inactive_line("worker", worker.id)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 1)
    story.advance(minutes(REPEAT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 2)


def test_a_helper_that_has_used_no_tool_for_fifteen_minutes_is_named_to_its_main_agent_with_a_request_to_check_on_it(new_story):
    story = new_story(fixture=HelperUnderBuilder)
    line = inactive_line("helper", story.helper.id)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"{line}: check on it")


def test_a_helper_that_used_a_tool_within_the_limit_is_not_named(new_story):
    story = new_story(fixture=HelperUnderBuilder)
    line = inactive_line("helper", story.helper.id)
    story.advance(minutes(GRACE_MINUTES - 1))
    story.hook("sub-1", HELPER_PROMPT)
    story.advance(minutes(GRACE_MINUTES - 1))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 0)


def test_a_helper_that_ended_is_not_named(new_story):
    story = new_story(fixture=HelperUnderBuilder)
    story.expect_success(f"agent end {story.helper.id}")
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{story.helper.id} has used no tool") == 0)


def test_a_worker_that_ended_is_not_named(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent end {worker.id}")
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"worker:{worker.id} has used no tool") == 0)


def test_the_setting_sets_how_long_a_helper_is_quiet_before_it_is_named(new_story):
    story = new_story(fixture=HelperUnderBuilder)
    later = GRACE_MINUTES * 2
    story.expect_success(f"setting make {INACTIVE_HELPER_GRACE_MINUTES} {later} --environment main", f"key: {INACTIVE_HELPER_GRACE_MINUTES}")
    story.hook("sub-1", HookSamples.session_start())
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{story.helper.id} has used no tool") == 0)
    story.advance(minutes(later - GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, inactive_line("helper", story.helper.id, later)) == 1)


def test_a_worker_is_not_named_within_its_grace(new_story):
    story, worker = idle_worker(new_story)
    story.advance(minutes(GRACE_MINUTES - 1))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"worker:{worker.id} has used no tool") == 0)


@pytest.fixture
def worker_ended_with_a_job(new_story):
    """A worker another agent ended and then sent a job, which no launcher could start."""
    story, worker = idle_worker(new_story)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(minutes(1))
    story.run(f'worker send --wait {worker.id} "Add the tax"', actor=story.agent)
    story.worker = worker
    return story


def test_an_ended_worker_whose_job_has_not_started_is_named_after_the_grace_and_again_every_five_minutes(worker_ended_with_a_job):
    story = worker_ended_with_a_job
    line = f"worker:{story.worker.id} has had work waiting for {GRACE_MINUTES} minutes and has not started: journal worker status {story.worker.id}"
    story.advance(minutes(GRACE_MINUTES - 1))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 0)
    story.advance(minutes(1))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 1)
    story.advance(minutes(REPEAT_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, line) == 2)


def test_a_worker_stopped_for_good_with_its_job_sent_before_is_not_named(new_story):
    story, worker = idle_worker(new_story)
    story.run(f'worker send --wait {worker.id} "Add the tax"', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, "has had work waiting") == 0)


def test_an_ended_helper_whose_job_has_not_started_is_named(new_story, monkeypatch):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent end {helper.id}", actor=Actor(helper.id, ActorType.AGENT))
    resumable_session(story, helper, monkeypatch)
    story.advance(minutes(1))
    story.expect_success(f'helper send {helper.id} "Read the cart"', actor=story.agent)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{helper.id} has had work waiting") == 1)
