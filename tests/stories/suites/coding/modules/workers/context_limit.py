from datetime import timedelta

import pytest

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE as COMPACT
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from engine.testing.examples.shell_part import ShellPart
from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import UserBuilder

LIMIT_TOKENS = 400_000
HARD = 600_000
SESSION = "s-1"
COMPACTION_START = HookSamples.session_start().with_raw({"source": "compact"})
PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)
CLEAR_START = HookSamples.session_start().with_raw({"source": "clear"})


class RecordedTyping(TerminalTyping):
    def __init__(self) -> None:
        self.typed: list[str] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append(line)


def typing_recorded(story):
    story.typing = RecordedTyping()
    story.container.bind(TerminalTyping, story.typing)
    return story


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=UserBuilder))


class LimitEnabled(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        enabled_time(story, LIMIT_TOKENS)


class TaskOwner(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        started_task(story)


class TaskOwnerLimit(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        started_task(story)


class TaskOwnerHardLimit(StoryFixture):
    parent = TaskOwnerLimit

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)


@pytest.fixture
def hard_limited_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwnerHardLimit))


@pytest.fixture
def limited_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwnerLimit))


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def task_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwner))


def has_context(story, tokens):
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": tokens}})


def set_value(story, key, value):
    story.expect_success(f"setting set {key} {value} --project", actor=story.user)


def enabled_time(story, tokens):
    set_value(story, CONTEXT_LIMIT_ENABLED, "true")
    set_value(story, CONTEXT_LIMIT_TOKENS, tokens)


def idle_turn(story):
    story.advance(timedelta(minutes=10))
    story.hook(SESSION, HookSamples.stop())


def started_task(story):
    story.expect_success('task make "Fix the cart" --brief "It adds tax twice"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)


def test_with_the_switch_off_an_agent_is_never_compacted(agent):
    has_context(agent, 900_000)
    agent.tick(SESSION)
    stops(agent)
    agent.expect_rows(agent.typing.typed == [])


def test_with_clear_chosen_the_limit_clears_the_context_and_a_cleared_agent_is_woken_to_go_on(limited):
    agent = limited
    set_value(agent, CONTEXT_LIMIT_ACTION, "clear")
    has_context(agent, LIMIT_TOKENS)
    stops(agent)
    agent.expect_rows(agent.typing.typed == ["/clear"], detail=str(agent.typing.typed))
    agent.hook(SESSION, CLEAR_START)
    agent.run_listeners()
    agent.expect_rows(len(agent.typing.typed) == 2 and "compacted" in agent.typing.typed[1], detail=str(agent.typing.typed))
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 2, detail=str(agent.typing.typed))


def expect_compaction_line(agent):
    agent.expect_rows(len(agent.typing.typed) == 1 and "compacted" in agent.typing.typed[0], detail=str(agent.typing.typed))


def test_a_typed_compaction_wakes_the_agent_as_soon_as_it_ends_and_only_once(limited):
    agent = limited
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.hook(SESSION, COMPACTION_START)
    agent.run_listeners()
    expect_compaction_line(agent)
    agent.hook(SESSION, HookSamples.prompt("[journal] your context was compacted"))
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail=str(agent.typing.typed))


def test_a_tick_never_compacts_an_agent(agent):
    agent.hook(SESSION, HookSamples.stop())
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, 900_000)
    agent.advance(timedelta(minutes=10))
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_finishes_its_task_first_and_is_compacted_when_it_ends(task_worker):
    agent = task_worker
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, LIMIT_TOKENS + 1)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [])
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_past_the_second_limit_an_agent_is_compacted_even_with_a_task_in_hand(agent):
    has_context(agent, HARD)
    set_value(agent, CONTEXT_LIMIT_HARD_TOKENS, HARD)
    enabled_time(agent, LIMIT_TOKENS)
    started_task(agent)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_past_the_second_limit_a_tool_is_refused_and_the_compaction_is_typed_at_once_with_a_task_in_hand(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="typed once while the last one runs")


def test_past_the_second_limit_a_memory_command_still_runs_so_a_stop_waiting_on_the_weighing_can_end(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD)
    weigh = HookSamples.shell("journal memory weigh 1 5", ShellPart("journal", CommandCategory.JOURNAL, ["memory", "weigh", "1", "5"]))
    agent.expect_hook_allowed(SESSION, weigh)
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_between_the_limits_a_tool_with_a_task_in_hand_is_not_refused(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD - 1)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def stops(story):
    story.hook(SESSION, HookSamples.prompt("go on"))
    story.hook(SESSION, HookSamples.stop())


def test_an_agent_that_stops_with_a_task_in_hand_is_not_compacted_at_the_stop(limited_worker):
    agent = limited_worker
    has_context(agent, LIMIT_TOKENS)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_an_agent_left_at_its_prompt_by_a_compaction_is_woken(agent):
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    expect_compaction_line(agent)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail="woken once")


@pytest.fixture
def overview_block(agent):
    agent.container.bind(OverviewFirst, OverviewFirst())
    agent.hook(SESSION, PRE_COMPACT)
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=40))
    return agent


def test_a_paused_agent_held_for_its_overview_is_not_woken(overview_block):
    agent = overview_block
    agent.expect_success(f"agent pause {agent.agent.id}", actor=agent.user)
    agent.typing.typed.clear()
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(not any("compacted" in line for line in agent.typing.typed), detail=str(agent.typing.typed))


def test_an_agent_past_the_limit_that_finishes_its_task_is_told_to_stop_and_given_no_next_task(task_worker):
    agent = task_worker
    agent.expect_success('task make "Fix the basket" --brief "It drops items"', actor=agent.agent)
    agent.expect_success("setting set journal.suites.coding.auto-mode true --environment main", actor=agent.user)
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, LIMIT_TOKENS)
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    agent.run_listeners()
    agent.expect_success("task show 2", "state: open", actor=agent.agent)
    agent.expect_hook_allowed(SESSION, HookSamples.sample("post_tool_use"), "stop now")
    agent.expect_success('memory skip "nothing to keep"', actor=agent.agent)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_a_compaction_typed_by_one_rule_is_not_typed_again_by_another_while_the_size_is_as_it_was(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(minutes=1))
    stops(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


@pytest.fixture
def compacted_agent(limited):
    has_context(limited, LIMIT_TOKENS)
    idle_turn(limited)
    return limited
