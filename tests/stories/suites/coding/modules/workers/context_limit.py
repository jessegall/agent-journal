from datetime import timedelta

import pytest

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE as COMPACT
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.testing.shell_part import ShellPart
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import BuilderWithUser

LIMIT = 400_000
HARD = 600_000
SESSION = "s-1"
COMPACTION_START = HookSamples.session_start().with_raw({"source": "compact"})


class RecordedTyping(TerminalTyping):
    def __init__(self) -> None:
        self.typed: list[str] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.typed.append(line)


def typing_recorded(story):
    story.typing = RecordedTyping()
    story.container.bind(TerminalTyping, story.typing)
    return story


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=BuilderWithUser))


class LimitOn(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story):
        turned_on_at(story, LIMIT)


class HoldingATask(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story):
        holds_a_task(story)


class LimitOnHoldingATask(StoryFixture):
    parent = LimitOn

    def steps(self, story):
        holds_a_task(story)


class HardLimitOnHoldingATask(StoryFixture):
    parent = LimitOnHoldingATask

    def steps(self, story):
        set_to(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)


@pytest.fixture
def hard_limited_with_a_task(new_story):
    return typing_recorded(new_story(fixture=HardLimitOnHoldingATask))


@pytest.fixture
def limited_with_a_task(new_story):
    return typing_recorded(new_story(fixture=LimitOnHoldingATask))


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitOn))


@pytest.fixture
def with_a_task(new_story):
    return typing_recorded(new_story(fixture=HoldingATask))


def has_context(story, tokens):
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": tokens}})


def set_to(story, key, value):
    story.expect_success(f"setting set {key} {value} --project", actor=story.user)


def turned_on_at(story, tokens):
    set_to(story, CONTEXT_LIMIT_ON, "true")
    set_to(story, CONTEXT_LIMIT_TOKENS, tokens)


def between_turns(story):
    story.advance(timedelta(minutes=10))
    story.hook(SESSION, HookSamples.stop())


def holds_a_task(story):
    story.expect_success('task make "Fix the cart" --brief "It adds tax twice"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)


def test_with_the_switch_off_an_agent_is_never_compacted(agent):
    has_context(agent, 900_000)
    agent.tick(SESSION)
    stops(agent)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_is_compacted_at_its_stop_once_its_context_reaches_the_limit(limited):
    agent = limited
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [], detail="no size reported")
    has_context(agent, LIMIT - 1)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [], detail="under the limit")
    has_context(agent, LIMIT)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.advance(timedelta(minutes=1))
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="not typed again while the last one runs")


def test_a_tick_never_compacts_an_agent(agent):
    agent.hook(SESSION, HookSamples.stop())
    turned_on_at(agent, LIMIT)
    has_context(agent, 900_000)
    agent.advance(timedelta(minutes=10))
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_finishes_its_task_first_and_is_compacted_when_it_ends(with_a_task):
    agent = with_a_task
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


def test_past_the_second_limit_a_tool_is_refused_and_the_compaction_is_typed_at_once_with_a_task_in_hand(hard_limited_with_a_task):
    agent = hard_limited_with_a_task
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="typed once while the last one runs")


def test_past_the_second_limit_a_memory_command_still_runs_so_a_stop_waiting_on_the_weighing_can_end(hard_limited_with_a_task):
    agent = hard_limited_with_a_task
    has_context(agent, HARD)
    weigh = HookSamples.shell("journal memory weigh 1 5", ShellPart("journal", CommandCategory.JOURNAL, ["memory", "weigh", "1", "5"]))
    agent.expect_hook_allowed(SESSION, weigh)
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_between_the_limits_a_tool_with_a_task_in_hand_is_not_refused(hard_limited_with_a_task):
    agent = hard_limited_with_a_task
    has_context(agent, HARD - 1)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_with_finishing_first_switched_off_a_task_in_hand_does_not_hold_it_back(agent):
    set_to(agent, CONTEXT_LIMIT_FINISH_TASK, "false")
    holds_a_task(agent)
    turned_on_at(agent, LIMIT)
    has_context(agent, LIMIT)
    between_turns(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def stops(story):
    story.hook(SESSION, HookSamples.prompt("go on"))
    story.hook(SESSION, HookSamples.stop())


def test_an_agent_with_no_task_in_hand_is_compacted_the_moment_it_stops(limited):
    agent = limited
    has_context(agent, LIMIT)
    stops(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_an_agent_that_stops_with_a_task_in_hand_is_not_compacted_at_the_stop(limited_with_a_task):
    agent = limited_with_a_task
    has_context(agent, LIMIT)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_an_agent_left_at_its_prompt_by_a_compaction_is_woken(agent):
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1 and "compacted" in agent.typing.typed[0], detail=str(agent.typing.typed))
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail="woken once")


def test_an_agent_working_again_after_a_compaction_is_not_woken(agent):
    agent.hook(SESSION, COMPACTION_START)
    agent.hook(SESSION, HookSamples.prompt("go on"))
    agent.advance(timedelta(seconds=10))
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_an_agent_past_the_limit_that_finishes_its_task_is_told_to_stop_and_given_no_next_task(with_a_task):
    agent = with_a_task
    agent.expect_success('task make "Fix the basket" --brief "It drops items"', actor=agent.agent)
    agent.expect_success("setting set journal.suites.coding.auto-mode true --environment main", actor=agent.user)
    turned_on_at(agent, LIMIT)
    has_context(agent, LIMIT)
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    agent.run_listeners()
    agent.expect_success("task show 2", "state: open", actor=agent.agent)
    agent.expect_hook_allowed(SESSION, HookSamples.sample("post_tool_use"), "stop now")
    agent.expect_success('memory skip "nothing to keep"', actor=agent.agent)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
