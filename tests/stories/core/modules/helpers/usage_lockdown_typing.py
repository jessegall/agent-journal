from engine.driver.program_lockdown import ProgramLockdown
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from core.modules.messages.models.message import Message
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import lockdown_story

AT_LIMIT = "Claude is at your usage limit until"


class KeptTyping(TerminalTyping):
    """Keeps the lines that pass the lockdown check, so a story reaches no launcher."""

    def __init__(self, lockdown: ProgramLockdown) -> None:
        self.lockdown = lockdown
        self.typed: list[str] = []

    def send_line(self, terminal_id: int, line: str) -> None:
        self.typed.append(line)


def typing_story(new_story) -> tuple[Story, KeptTyping]:
    story = lockdown_story(new_story)
    typing = KeptTyping(story.container.get(ProgramLockdown))
    story.container.bind(TerminalTyping, typing)
    story.hook("s-1", HookSamples.stop())
    report(story, 55)
    UsageLimitMarker()(story.container)
    return story, typing


def end_lockdown(story: Story) -> None:
    story.expect_success("usage-limit delete 1", actor=story.user)
    UsageLimitMarker()(story.container)
    story.run_listeners()


def test_a_line_a_person_types_into_a_stopped_agents_terminal_is_refused_with_the_reason(new_story):
    story, typing = typing_story(new_story)
    story.expect_refusal(f'agent type {story.agent.id} "ls"', AT_LIMIT, actor=story.user)
    story.expect_rows(typing.typed == [])
    end_lockdown(story)
    story.expect_success(f'agent type {story.agent.id} "ls"', actor=story.user)
    story.expect_rows(typing.typed == ["ls"])


def test_a_pause_at_the_lockdown_is_recorded_and_its_line_is_typed_once_after_the_end(new_story):
    story, typing = typing_story(new_story)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(typing.typed == [], story.row(Agent, story.agent.id).paused_at is not None)
    end_lockdown(story)
    UsageLimitMarker()(story.container)
    story.expect_rows(len(typing.typed) == 1)


def test_a_message_sent_at_the_lockdown_is_not_typed_or_delivered_until_the_end(new_story):
    story, typing = typing_story(new_story)
    message = story.new_row_id(f'message send "Please fix the cart" --to agent:{story.agent.id} --environment main', actor=story.user)
    story.run_listeners()
    story.expect_rows(typing.typed == [], story.row(Message, message).delivered_at is None, story.row(Message, message).read_at is None)
    end_lockdown(story)
    story.expect_rows(len(typing.typed) == 1, str(message) in typing.typed[0])
