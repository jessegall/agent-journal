import pytest

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.commands.start_merger.start_merger_handler import StartMergerHandler
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.worker_ask import asking_worker


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


def newest_kept_merger(story) -> Agent | None:
    return story.container.get(Queries).query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()


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


def test_a_merger_on_a_program_its_profile_no_longer_lists_is_replaced(unread_line, monkeypatch):
    story = unread_line.story
    with running_launcher(story):
        MergerRetry()(story.container)
    old = merger_agent(story)
    story.run(f"agent end {old.id}", actor=story.agent)
    monkeypatch.setattr(StartMergerHandler, "fits_profile", lambda _handler, _kept: False)
    with running_launcher(story):
        story.container.get(Bus).run(StartMerger("a line waits"), Actor.core(), environment_id=1)
    new = newest_kept_merger(story)
    story.expect_rows(story.row(Agent, old.id).retired_at is not None, new is not None and new.id != old.id, detail=str(new))


def test_nothing_starts_a_merger_when_no_line_waits(waiting_worker):
    story = waiting_worker.story
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)


def test_with_the_merger_off_an_unread_line_starts_nothing(unread_line):
    story = unread_line.story
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    with running_launcher(story):
        MergerRetry()(story.container)
    story.expect_rows(merger_agent(story) is None)
