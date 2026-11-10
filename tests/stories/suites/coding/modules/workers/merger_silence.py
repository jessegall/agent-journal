from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.messages.models.message import Message
from core.testing.fake_launcher import FakeLauncher
from core.testing.story import Story
from core.testing.story_helper_programs import StoryHelperPrograms
from core.testing.story_shell_sandbox import StoryShellSandbox
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

RETURNED_MERGE_REPORT = "does not seem able to fix it"
CLOSING_MESSAGE = "No merge is pending."


@dataclass(frozen=True)
class WorkerWithMerger:
    """A worker with its merger running, and what the merger has sent the main agent."""

    story: Story
    worker: Actor
    agent: Agent

    @property
    def actor(self) -> Actor:
        return Actor(self.agent.id, ActorType.AGENT)

    def texts(self) -> list[str]:
        return [message.text for message in self.story.container.get(Queries).query(Message).filter(session_agent_id=self.agent.id).all_rows()]

    def return_merge(self, count: int) -> None:
        for _ in range(count):
            self.story.expect_success(f'merger findings {self.worker.id} "The tax is added twice"', actor=self.actor)
        self.story.run_listeners()


@pytest.fixture
def worker_with_merger(new_story, monkeypatch):
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_success('worker report "Converted the window"', actor=worker)
        story.run_listeners()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)
    return WorkerWithMerger(story, worker, merger_agent(story))


def test_sending_a_merge_back_stays_silent_until_the_third_time_and_then_the_count_starts_again(worker_with_merger):
    worker_with_merger.return_merge(2)
    worker_with_merger.story.expect_rows(worker_with_merger.texts() == [], detail=str(worker_with_merger.texts()))
    worker_with_merger.return_merge(1)
    reports = [text for text in worker_with_merger.texts() if RETURNED_MERGE_REPORT in text]
    worker_with_merger.story.expect_rows(len(reports) == 1, f"Worker {worker_with_merger.worker.id} was sent back 3 times" in reports[0], detail=str(reports))
    worker_with_merger.return_merge(2)
    worker_with_merger.story.expect_rows(len([text for text in worker_with_merger.texts() if RETURNED_MERGE_REPORT in text]) == 1, detail=str(worker_with_merger.texts()))


def test_the_limit_is_the_setting_a_person_chose(worker_with_merger):
    worker_with_merger.story.expect_success("setting set journal.suites.coding.workers.hand-in-failures-to-flag 2 --project", actor=worker_with_merger.story.user)
    worker_with_merger.return_merge(2)
    worker_with_merger.story.expect_rows(any("sent back 2 times" in text for text in worker_with_merger.texts()), detail=str(worker_with_merger.texts()))
