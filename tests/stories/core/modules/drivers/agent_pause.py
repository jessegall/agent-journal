from core.base.driver.tool_type import ToolType
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.testing.hook_samples import HookSamples
from core.base.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.overlays.paused_overlay import PausedOverlay
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask, OrchestratorWithOpenTask, SubagentStarted
from tests.stories.core.support.fixtures import UserJoined

JOURNAL_LINE = HookSamples.shell("journal message show 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "show", "1"], subcommand="message")).with_fields(event="post_tool_use")
READ_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["a.py"], "diff": None})
EDIT_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def test_a_paused_agents_tool_calls_are_refused_until_it_is_resumed(new_story):
    story = new_story(fixture=UserJoined)
    story.container.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {story.agent.id}", f"paused agent {story.agent.id}", actor=story.user)
    story.expect_hook_refusal("s-1", EDIT_SAMPLE, "the user paused you")
    story.expect_success(f"agent resume {story.agent.id}", f"resumed agent {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT_SAMPLE)


def test_resume_types_that_it_may_carry_on(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_rows(typing.typed == [(story.agent.id, "[journal] the user resumed you: carry on where you stopped")])


def test_resume_types_only_after_its_commit_and_the_line_is_not_said_twice(new_story):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    withheld: list[bool] = []

    class WatchedTyping(FakeTyping):
        def type_line(self, agent_id: int, line: str) -> None:
            withheld.append(database.has_transaction)
            super().type_line(agent_id, line)

    story.container.bind(TerminalTyping, WatchedTyping())
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_rows(withheld == [False])
    story.expect_text(f"agent-line list --agent {story.agent.id} --state entered", "the user resumed you", actor=story.user)
    story.expect_absent(f"agent-line list --agent {story.agent.id} --state waiting", "the user resumed you", actor=story.user)


def test_with_no_terminal_the_resume_line_waits_for_the_next_hook(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "the user resumed you", actor=story.user)


def test_only_a_person_pauses_or_resumes_and_the_state_must_fit(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f"agent pause {story.agent.id}", "only a person pauses", actor=story.agent)
    story.expect_refusal(f"agent resume {story.agent.id}", "only a person resumes", actor=story.agent)
    story.expect_refusal(f"agent resume {story.agent.id}", "is not paused", actor=story.user)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_refusal(f"agent pause {story.agent.id}", "is paused already", actor=story.user)


def paused_story(new_story, fixture):
    story = new_story(fixture=fixture)
    story.container.bind(TerminalTyping, FakeTyping())
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


def test_a_paused_agent_with_a_task_in_hand_may_stop(new_story):
    story = paused_story(new_story, BuilderWithStartedTask)
    assert story.hook("s-1", HookSamples.stop()).refusal
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    assert story.hook("s-1", HookSamples.stop()).refusal


def test_a_paused_agent_is_given_no_new_task_at_its_stop(new_story):
    story = paused_story(new_story, OrchestratorWithOpenTask)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_a_paused_agent_can_still_run_journal_lines(new_story):
    story = paused_story(new_story, BuilderWithStartedTask)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", JOURNAL_LINE)


def test_a_subagent_of_a_paused_agent_is_paused_too(new_story):
    story = paused_story(new_story, SubagentStarted)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_hook_refusal("s-1", READ_SAMPLE.with_fields(subagent="sub-1"), "the user paused you")
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", READ_SAMPLE.with_fields(subagent="sub-1"))


def test_the_pause_ends_with_the_agent(new_story):
    story = paused_story(new_story, BuilderWithStartedTask)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Agent).find(story.agent.id).paused_at is None)


def test_a_worker_pauses_on_its_own_and_not_with_the_agent_that_sent_it(new_story):
    story = paused_story(new_story, SubagentStarted)
    worker = next(agent for agent in story.container.get(Queries).query(Agent).all_rows() if agent.parent_id == story.agent.id)
    story.container.get(Database).connection.execute("UPDATE agents SET role = 'worker' WHERE id = ?", [worker.id])
    overlay = PausedOverlay(story.container.get(Queries))
    story.expect_rows(overlay.open_rows(worker.id) == [])
    story.expect_success(f"agent pause {worker.id}", f"paused agent {worker.id}", actor=story.user)
    story.expect_rows(overlay.open_rows(worker.id) != [])
