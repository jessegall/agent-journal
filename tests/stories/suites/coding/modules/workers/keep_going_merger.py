import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from engine.testing.examples.hook_samples import HookSamples
from engine.enums.agent_role import AgentRole
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger_cases import merger_case
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.support.story_checks import expect_value_with
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.worker_ask import asking_worker
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED

TEST_ROWS_REASON = "the test reads every row it checks"


@pytest.fixture
def waiting_worker(new_story, monkeypatch):
    worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    merger_can_start(monkeypatch)
    return worker


@pytest.fixture
def unread_line(waiting_worker):
    waiting_worker.post_question()
    waiting_worker.story.run_listeners()
    waiting_worker.story.expect_rows(merger_agent(waiting_worker.story) is None, detail="the merger could not start while nothing launches")
    return waiting_worker


def test_an_unread_line_with_no_merger_running_starts_one(unread_line):
    story = unread_line.story
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is not None)


def unavailable_sandbox(*_args) -> None:
    raise Refusal("read-only shell sandbox could not be checked")


def test_a_failed_merger_start_is_tried_again_at_the_next_round(unread_line, monkeypatch):
    story = unread_line.story
    sandbox = story.container.get(ShellSandbox)
    monkeypatch.setattr(sandbox, "check", unavailable_sandbox)
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)
    monkeypatch.delattr(sandbox, "check")
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is not None)


def test_a_failed_merger_start_tells_the_main_agent_once(unread_line, monkeypatch):
    story = unread_line.story
    monkeypatch.setattr(story.container.get(ShellSandbox), "check", unavailable_sandbox)
    with running_launcher(story):
        MergerRetry()(story.container)
        MergerRetry()(story.container)
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows(lines.count("the merger did not start: read-only shell sandbox") == 1, detail=lines)


def test_nothing_starts_a_merger_when_no_line_waits(waiting_worker):
    story = waiting_worker.story
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)


def test_with_the_merger_off_an_unread_line_starts_nothing(unread_line):
    story = unread_line.story
    story.expect_success(f"setting set {MERGER_ENABLED} false --project", actor=story.user)
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)


@pytest.fixture
def merger_that_read_the_line(unread_line):
    story = unread_line.story
    with running_launcher(story):
        MergerRetry()(story.container)
    merger = Actor(merger_agent(story).id, ActorType.AGENT)
    story.expect_success("merger next", actor=merger)
    expect_unread_lines(story, 0)
    return unread_line, merger


def expect_unread_lines(story, count: int) -> None:
    unread = tuple(story.container.get(Queries).query(MergerLine).matching(IsNull("read_at")).matching(IsNull("read_output_id")).every_row(TEST_ROWS_REASON))
    story.expect_rows(len(unread) == count, detail=str(unread))


def retry_after_the_merger_ended(story) -> None:
    with running_launcher(story):
        MergerRetry()(story.container)


def test_a_line_the_merger_read_and_did_nothing_about_comes_back(merger_that_read_the_line):
    worker, merger = merger_that_read_the_line
    retry_after_the_merger_ended(worker.story)
    expect_unread_lines(worker.story, 1)


@pytest.fixture
def merger_with_ended_main(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    case = merger_case(story, repository_environment(story))
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    story.expect_success('merger tell "Which rounding applies?" --tried "Read the brief" --option "Up" --option "Down" --recommend "Up"', actor=case.merger)
    return case


def newest_main_agent_id(story) -> int:
    return story.container.get(Queries).query(Agent).filter(role=AgentRole.MAIN).newest().first().id


def test_a_tell_with_no_main_agent_running_reaches_the_next_main_agent(merger_with_ended_main):
    story = merger_with_ended_main.story
    ended_main_agent_id = newest_main_agent_id(story)
    story.hook("s-next", HookSamples.session_start())
    story.run_listeners()
    next_main_agent_id = newest_main_agent_id(story)
    story.expect_rows(next_main_agent_id == ended_main_agent_id)
    expect_value_with(story.run(f"agent-line list --agent {next_main_agent_id}").output_text, "reported in message:")
