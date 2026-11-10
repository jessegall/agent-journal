from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory

from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.processes.support.process_samples import start_process
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.modules.workers.support.worker_settings import INACTIVE_HELPER_GRACE_MINUTES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator, BuilderHelper
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
GRACE_MINUTES = 15
REPEAT_MINUTES = 5
HELPER_PROMPT = HookSamples.prompt("Read the cart")

START_SECONDS = 60


def minutes(count: int) -> timedelta:
    return timedelta(minutes=count)


def inactive_line(role: str, agent_id: int, count: int = GRACE_MINUTES) -> str:
    return f"{role}:{agent_id} has used no tool for {count} minutes"


def line_count(story, line: str) -> int:
    return story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line)


def merger_change(story, agent_id: int) -> None:
    database = story.container.get(Database)
    with database.transaction():
        database.connection.execute("UPDATE agents SET profile = ? WHERE id = ?", (MERGER_PROFILE, agent_id))


class BuilderMerger(StoryFixture):
    parent = BuilderHelper

    def steps(self, story):
        merger_change(story, story.helper.id)


class StartedMerger(StoryFixture):
    parent = StartedHelper

    def steps(self, story):
        merger_change(story, helper_agent(story).id)


def idle_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    return story, worker


def test_the_inactive_line_wakes_the_main_agent(new_story):
    story, worker = idle_worker(new_story)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    line = next(row for row in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if f"worker:{worker.id} has used no tool" in row.text)
    story.expect_rows(line.wakes_agent)


def test_a_worker_that_never_made_a_call_is_named_with_the_command_for_its_log_and_wakes_the_main_agent(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.advance(timedelta(seconds=START_SECONDS))
    story.tick(MAIN_SESSION)
    line = next(row for row in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).all_rows() if f"worker:{worker.id} made no call" in row.text)
    story.expect_rows(line.wakes_agent, f"worker:{worker.id} made no call" in line.text)


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
    story.expect_text(f"agent-line list --agent {main.id}", f"run {process.id} waits, 2 ahead", f"journal worker status {agent_number(story, worker.id)}", actor=main)


def test_a_helper_that_has_used_no_tool_for_fifteen_minutes_is_named_to_its_main_agent_with_a_request_to_check_on_it(new_story):
    story = new_story(fixture=BuilderHelper)
    line = inactive_line("helper", story.helper.id)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"{line}: check on it")


def test_an_idle_merger_is_not_named(new_story):
    story = new_story(fixture=BuilderMerger)
    story.tick(MAIN_SESSION)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_absent(f"agent-line list --agent {story.agent.id}", inactive_line("helper", story.helper.id))


def test_a_helper_that_ended_is_not_named(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_success(f"agent end {story.helper.id}")
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{story.helper.id} has used no tool") == 0)


def test_a_worker_that_ended_is_not_named(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent end {worker.id}")
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"worker:{worker.id} has used no tool") == 0)


def test_the_setting_sets_how_long_a_helper_is_quiet_before_it_is_named(new_story):
    story = new_story(fixture=BuilderHelper)
    later = GRACE_MINUTES * 2
    story.expect_success(f"setting make {INACTIVE_HELPER_GRACE_MINUTES} {later} --environment main", f"key: {INACTIVE_HELPER_GRACE_MINUTES}")
    story.hook("sub-1", HookSamples.session_start())
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{story.helper.id} has used no tool") == 0)
    story.advance(minutes(later - GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, inactive_line("helper", story.helper.id, later)) == 1)


def test_a_worker_stopped_for_good_with_its_job_sent_before_is_not_named(new_story):
    story, worker = idle_worker(new_story)
    story.run(f'worker send --wait {agent_number(story, worker.id)} "Add the tax"', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, "has had work waiting") == 0)


def expect_waiting_job_name(story, monkeypatch) -> None:
    helper = helper_agent(story)
    story.expect_success(f"agent end {helper.id}", actor=Actor(helper.id, ActorType.AGENT))
    resumable_session(story, helper, monkeypatch)
    story.advance(minutes(1))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "Read the cart"', actor=story.agent)
    story.advance(minutes(GRACE_MINUTES))
    story.tick(MAIN_SESSION)
    story.expect_rows(line_count(story, f"helper:{helper.id} has had work waiting") == 1)


def test_an_ended_helper_whose_job_has_not_started_is_named(new_story, monkeypatch):
    expect_waiting_job_name(new_story(fixture=StartedHelper), monkeypatch)


def test_an_ended_merger_whose_job_has_not_started_is_named_too(new_story, monkeypatch):
    story = new_story(fixture=StartedMerger)
    story.advance(minutes(1))
    expect_waiting_job_name(story, monkeypatch)
