from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.testing.examples.shell_part import ShellPart
from engine.enums.tool_type import ToolType
from core.modules.agents.support.terminal_typing import TerminalTyping
from engine.testing.examples.hook_samples import HookSamples
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from tests.stories.core.modules.agents.support.numbered_agents import MainWithOneWorker
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from tests.stories.core.support import story_lines as lines
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, OpenTaskOrchestrator, BuilderHelper
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_refusal_hook
from tests.stories.core.support.agent_labels import agent_label

JOURNAL_LINE = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")
READ_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["a.py"], "diff": None})
READ_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": ["a.py"], "shell": None, "diff": None})
LISTING_SAMPLE = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.READ, ["build"])).with_fields(event="pre_tool_use")
JOURNAL_SAMPLE = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task")).with_fields(event="pre_tool_use")
MESSAGE_SAMPLE = HookSamples.shell("journal message unread", ShellPart("journal", CommandCategory.JOURNAL, ["message", "unread"], subcommand="message")).with_fields(event="pre_tool_use")
NESTED_JOURNAL_SAMPLE = HookSamples.shell('bash -c "journal task close 1"', ShellPart("bash", CommandCategory.READ, ["-c", "journal task close 1"], nested_journal_commands=[["task", "close", "1"]])).with_fields(event="pre_tool_use")
BUILD_SAMPLE = HookSamples.shell("make", ShellPart("make", CommandCategory.BUILD, [])).with_fields(event="pre_tool_use")
WRITING_LISTING_SAMPLE = HookSamples.shell("cp a b", ShellPart("cp", CommandCategory.EDIT, ["a", "b"], effects=[CommandEffect.WRITES_FILES])).with_fields(event="pre_tool_use")
EDIT_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})
WORKER_SESSION = "s-2"


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def test_a_paused_agents_tool_calls_are_refused_until_it_is_resumed(new_story):
    story = new_story(fixture=UserJoined)
    story.container.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", f"paused {agent_label(story, story.agent.id)}", actor=story.user)
    story.expect_hook_refusal("s-1", EDIT_SAMPLE, "The user paused you")
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", f"resumed {agent_label(story, story.agent.id)}", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT_SAMPLE)


def test_a_paused_agent_may_read_and_run_message_commands_and_is_not_told_of_the_pause_on_what_it_may_do(new_story):
    story = new_story(fixture=UserJoined)
    story.container.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_refusal("s-1", JOURNAL_SAMPLE, "The user paused you")
    story.expect_hook_refusal("s-1", NESTED_JOURNAL_SAMPLE, "The user paused you")
    for allowed in (READ_SAMPLE, LISTING_SAMPLE, MESSAGE_SAMPLE):
        story.expect_absent_hook_line("s-1", allowed, "The user paused you")
        story.expect_hook_allowed("s-1", allowed)
    story.expect_hook_refusal("s-1", EDIT_SAMPLE, "The user paused you")
    story.expect_hook_refusal("s-1", WRITING_LISTING_SAMPLE, "The user paused you")


def test_resume_types_only_after_its_commit_and_the_line_is_not_said_twice(watched_paused_agent):
    story, database, transaction_flags = watched_paused_agent
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_rows(transaction_flags == [False, False])
    story.expect_text(f"agent-line list --agent {story.agent.id} --state entered", "The user resumed you", actor=story.user)
    story.expect_absent(f"agent-line list --agent {story.agent.id} --state waiting", "The user resumed you", actor=story.user)


def test_with_no_terminal_the_resume_line_waits_for_the_next_hook(paused_agent_without_terminal):
    story = paused_agent_without_terminal
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "The user resumed you", actor=story.user)


def test_pausing_and_resuming_must_fit_the_state(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f"agent resume {agent_number(story, story.agent.id)}", "is not paused", actor=story.agent)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_refusal(f"agent pause {agent_number(story, story.agent.id)}", "is paused already", actor=story.user)


def test_a_helper_of_a_paused_agent_cannot_resume_it(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id(f"agent start s-sub claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_refusal(f"agent resume {agent_number(story, story.agent.id)} --reason needed", "The main agent was asked to review this request", actor=helper)
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)


def test_a_paused_agent_cannot_resume_itself_and_the_user_resumes_it(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_refusal(f"agent resume {agent_number(story, story.agent.id)} --reason needed", "A user was asked in the dock", actor=story.agent)
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)


def paused_story(new_story, fixture):
    story = new_story(fixture=fixture)
    story.container.bind(TerminalTyping, FakeTyping())
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


def test_a_paused_agent_with_a_task_in_hand_may_stop(new_story):
    story = paused_story(new_story, StartedTaskBuilder)
    expect_refusal_hook(story, "s-1")
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    expect_refusal_hook(story, "s-1")


def test_a_paused_agent_is_given_no_new_task_at_its_stop(new_story):
    story = paused_story(new_story, OpenTaskOrchestrator)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_a_paused_agent_can_still_run_journal_lines(paused_task_holder):
    story = paused_task_holder
    story.expect_hook_allowed("s-1", JOURNAL_LINE)


def test_a_helper_of_a_paused_agent_is_paused_too(new_story):
    story = paused_story(new_story, BuilderHelper)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_refusal("sub-1", BUILD_SAMPLE, "The user paused you")
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_allowed("sub-1", BUILD_SAMPLE)


def test_the_pause_ends_with_the_agent(paused_task_holder):
    story = paused_task_holder
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_rows(story.container.get(Queries).query(Agent).find(story.agent.id).paused_at is None)


def test_a_worker_of_a_paused_agent_may_only_read_and_goes_on_after_the_resume(new_story):
    story = paused_story(new_story, MainWithOneWorker)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_hook_refusal(WORKER_SESSION, EDIT_SAMPLE, "The user paused you")
    story.expect_hook_refusal(WORKER_SESSION, WRITING_LISTING_SAMPLE, "The user paused you")
    for allowed in (READ_SAMPLE, LISTING_SAMPLE):
        story.expect_absent_hook_line(WORKER_SESSION, allowed, "The user paused you")
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_absent_hook_line(WORKER_SESSION, EDIT_SAMPLE, "The user paused you")


@pytest.fixture
def paused_task_holder(new_story):
    story = paused_story(new_story, StartedTaskBuilder)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    return story


@pytest.fixture
def watched_paused_agent(new_story):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    transaction_flags: list[bool] = []

    class WatchedTyping(FakeTyping):
        def send_line(self, agent_id: int, line: str) -> None:
            transaction_flags.append(database.has_transaction)
            super().send_line(agent_id, line)

    story.container.bind(TerminalTyping, WatchedTyping())
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    return story, database, transaction_flags


@pytest.fixture
def paused_agent_without_terminal(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    return story
