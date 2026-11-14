from dataclasses import dataclass
from pathlib import Path

from core.modules.messages.models.message import Message
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIBRARIES_LINKED
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from tests.stories.core.support.agent_labels import agent_number
from tests.integration.suites.coding.modules.workers.test_merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.support.merger_launcher import running_launcher
from tests.stories.support.story_checks import expect_value_with
import pytest
import suites.coding.modules.workers as workers_package

TEST_ROWS_REASON = "the test reads every row it checks"
MERGER_ROLE_REFUSAL = "only the merger runs this"
WORKER_NOTICE_REFUSAL = "A worker may not run merger tell"
LOG_REVIEW_REFUSAL = "reviews no worker's logs"
LOG_LINE = "The cart total rounds down"
FULL_SUITE = "pytest"
WHY = "the rounding only shows in a real run"
MERGER_QUESTION = 'merger tell "Which tax applies?" --tried "Read the brief" --option "Dutch tax" --option "No tax" --recommend "Dutch tax"'
LINKED_LINE = WORKER_LIBRARIES_LINKED.nudge().text
LIBRARY_FILE = "index.js"
LIBRARY_TEXT = "module.exports = 1\n"


@dataclass(frozen=True)
class MergerCase:
    """A worker with its merger running, and the rows the stories compare."""

    story: Story
    repository: GitRepository
    worker: Actor
    merger: Actor

    def scope(self) -> str:
        outcome = self.story.run(f"merger scope {agent_number(self.story, self.worker.id)}", actor=self.merger)
        assert outcome.code == 0, outcome.output_text
        return outcome.output_text

    def refused_at_hand_in(self, text: str) -> None:
        worktree = self.story.container.get(Queries).query(Worktree).filter(session_agent_id=self.worker.id).first()
        self.story.container.get(Bus).run(RecordWorkerRefusal(worktree.id, text), self.worker, environment_id=1)

    def main_lines(self) -> str:
        self.story.run_listeners()
        return self.story.run(f"agent-line list --agent {self.story.agent.id}", actor=self.story.agent).output_text

    def worker_lines(self) -> str:
        self.story.run_listeners()
        return self.story.run(f"agent-line list --agent {self.worker.id}").output_text

    def worker_messages(self) -> str:
        self.story.run_listeners()
        return "\n".join(message.text for message in self.story.container.get(Queries).query(Message).filter(target_agent_id=self.worker.id).every_row(TEST_ROWS_REASON))

    def main_messages(self) -> tuple[Message, ...]:
        return tuple(self.story.container.get(Queries).query(Message).filter(session_agent_id=self.merger.id).every_row(TEST_ROWS_REASON))

    def marks(self) -> str:
        self.story.run_listeners()
        return self.story.run("chat-mark list --environment 1").output_text


def running_merger(story: Story, worker: Actor) -> Actor:
    with running_launcher(story):
        story.expect_success('worker report "The cart needs a look"', actor=worker)
        story.run_listeners()
    return Actor(merger_agent(story).id, ActorType.AGENT)


def merger_case(story: Story, repository: GitRepository, dispatch: str = DISPATCH) -> MergerCase:
    worker = dispatched_worker(story, dispatch)
    return MergerCase(story, repository, worker, running_merger(story, worker))


def merger_skill_text() -> str:
    return (Path(workers_package.__file__).parent / "skills" / f"{MERGER_PROFILE.name}" / "SKILL.md").read_text()


def logs_read_at(story: Story, worker: Actor) -> str | None:
    return story.container.get(Queries).query(Worktree).filter(session_agent_id=worker.id).first().logs_read_at


@pytest.mark.parametrize("case_text", ["journal merger scope", "journal merger repair", "journal helper grant", "already built", "add the case to this file"])
def test_the_case_book_holds_each_known_case(case_text):
    expect_value_with(merger_skill_text(), case_text)
