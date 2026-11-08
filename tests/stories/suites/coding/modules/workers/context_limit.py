from datetime import timedelta

import pytest

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import BuilderWithUser

COMPACT = "/compact"
LIMIT = 400_000
HARD = 600_000
SESSION = "s-1"


class RecordedTyping(TerminalTyping):
    def __init__(self) -> None:
        self.typed: list[str] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.typed.append(line)


@pytest.fixture
def agent(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.typing = RecordedTyping()
    story.container.bind(TerminalTyping, story.typing)
    return story


def has_context(story, tokens):
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": tokens}})


def set_to(story, key, value):
    story.expect_success(f"setting set {key} {value} --project", actor=story.user)


def turned_on_at(story, tokens):
    set_to(story, CONTEXT_LIMIT_ON, "true")
    set_to(story, CONTEXT_LIMIT_TOKENS, tokens)


def between_turns(story):
    story.advance(timedelta(minutes=10))
    story.tick(SESSION)


def holds_a_task(story):
    story.expect_success('task make "Fix the cart" --brief "It adds tax twice"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)


def test_with_the_switch_off_an_agent_is_never_compacted(agent):
    has_context(agent, 900_000)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_is_compacted_between_its_turns_once_its_context_reaches_the_limit(agent):
    turned_on_at(agent, LIMIT)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [], detail="no size reported")
    has_context(agent, LIMIT - 1)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [], detail="under the limit")
    has_context(agent, LIMIT)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.advance(timedelta(minutes=1))
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="not typed again while the last one runs")


def test_an_agent_in_the_middle_of_a_turn_is_not_compacted(agent):
    agent.hook(SESSION, HookSamples.prompt("go on"))
    turned_on_at(agent, LIMIT)
    has_context(agent, 900_000)
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_finishes_its_task_first_and_is_compacted_when_it_ends(agent):
    holds_a_task(agent)
    turned_on_at(agent, LIMIT)
    has_context(agent, LIMIT + 1)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [])
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_past_the_second_limit_an_agent_is_compacted_even_with_a_task_in_hand(agent):
    has_context(agent, HARD)
    set_to(agent, CONTEXT_LIMIT_HARD_TOKENS, HARD)
    turned_on_at(agent, LIMIT)
    holds_a_task(agent)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_with_finishing_first_switched_off_a_task_in_hand_does_not_hold_it_back(agent):
    set_to(agent, CONTEXT_LIMIT_FINISH_TASK, "false")
    holds_a_task(agent)
    turned_on_at(agent, LIMIT)
    has_context(agent, LIMIT)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
