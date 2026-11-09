from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.base.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.messages.models.message import Message
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

SENT_BACK_REPORT = "does not seem able to fix it"
CLOSING_WORDS = "No merge is pending."


@dataclass(frozen=True)
class RunningMerger:
    """A worker with its merger running, and what the merger has sent the main agent."""

    story: Story
    worker: Actor
    agent: Agent

    @property
    def actor(self) -> Actor:
        return Actor(self.agent.id, ActorType.AGENT)

    def texts(self) -> list[str]:
        return [message.text for message in self.story.container.get(Queries).query(Message).filter(session_agent_id=self.agent.id).all_rows()]

    def send_back(self, times: int) -> None:
        for _ in range(times):
            self.story.expect_success(f'merger findings {self.worker.id} "The tax is added twice"', actor=self.actor)
        self.story.run_listeners()


@pytest.fixture
def running_merger(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        story.expect_success('worker report "Converted the window"', actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    return RunningMerger(story, worker, merger_agent(story))


def test_the_mergers_closing_words_make_no_message_for_the_main_agent(running_merger):
    stop = HookSamples.stop()
    running_merger.story.hook(running_merger.agent.session, stop.with_raw({**stop.body["raw"], "last_assistant_message": CLOSING_WORDS}))
    running_merger.story.expect_rows(CLOSING_WORDS not in " ".join(running_merger.texts()), detail=str(running_merger.texts()))


def test_sending_a_merge_back_stays_silent_until_the_third_time_and_then_the_count_starts_again(running_merger):
    running_merger.send_back(2)
    running_merger.story.expect_rows(running_merger.texts() == [], detail=str(running_merger.texts()))
    running_merger.send_back(1)
    reports = [text for text in running_merger.texts() if SENT_BACK_REPORT in text]
    running_merger.story.expect_rows(len(reports) == 1, f"Worker {running_merger.worker.id} was sent back 3 times" in reports[0], detail=str(reports))
    running_merger.send_back(2)
    running_merger.story.expect_rows(len([text for text in running_merger.texts() if SENT_BACK_REPORT in text]) == 1, detail=str(running_merger.texts()))


def test_the_limit_is_the_setting_a_person_chose(running_merger):
    running_merger.story.expect_success("setting set journal.suites.coding.workers.hand-in-failures-to-flag 2 --project", actor=running_merger.story.user)
    running_merger.send_back(2)
    running_merger.story.expect_rows(any("sent back 2 times" in text for text in running_merger.texts()), detail=str(running_merger.texts()))


def test_a_request_for_help_still_reaches_the_main_agent(running_merger):
    running_merger.story.expect_success('merger tell "Which tax applies?" --tried "Read the brief" --option "Dutch tax" --option "No tax" --recommend "Dutch tax"', actor=running_merger.actor)
    running_merger.story.run_listeners()
    running_merger.story.expect_rows(any("Which tax applies?" in text for text in running_merger.texts()), detail=str(running_merger.texts()))
