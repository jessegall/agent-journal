import os
from datetime import timedelta

import pytest

from engine.errors.refusal import Refusal
from core.modules.agents.support.terminal_typing import LAUNCHER_MISSING, TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE as COMPACT, ClaudeCodeProvider
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_HARD_TOKENS
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, HARD, LIMIT_TOKENS, PRE_COMPACT, SESSION, LimitEnabled, RecordedTyping, has_context, set_value, stops, typing_recorded

OVERLONG = timedelta(seconds=601)
EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
STATUS_FILE_AGE = timedelta(seconds=60)
GROWTH_TOKENS = LIMIT_TOKENS // 10
TOKENS_OVER_LIMIT = LIMIT_TOKENS + 50_000
STOPS_WITHOUT_LAUNCHER = 5
WAITING_IN_THE_PROGRAM = timedelta(seconds=20)
RETRY_DUE = timedelta(seconds=181)


def compacted(story, trigger):
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": trigger}))
    story.hook(SESSION, COMPACTION_START)
    story.run_listeners()


class HardLimitEnabled(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)


class AutoCompacted(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        compacted(story, "auto")


class ManualCompacted(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        compacted(story, "manual")


class HardAutoCompacted(StoryFixture):
    parent = HardLimitEnabled

    def steps(self, story):
        compacted(story, "auto")


class LimitedMemory(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        story.expect_success('memory make "The cart total is in cents" --environment main', "created: memory:1", actor=story.agent)


class CompactedLimitedMemory(StoryFixture):
    parent = LimitedMemory

    def steps(self, story):
        compacted(story, "auto")


class ContextFact(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.expect_success('memory make "The cart total is in cents" --environment main', "created: memory:1", actor=story.agent)


class CompactedFact(StoryFixture):
    parent = ContextFact

    def steps(self, story):
        compacted(story, "auto")


@pytest.fixture(autouse=True)
def program_without_its_own_window(monkeypatch):
    """These stories are of the typed compaction line, which the stop types only for a program that does not
    compact by its own window."""
    monkeypatch.setattr(ClaudeCodeProvider, "has_windowed_compaction", False)


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def hard_agent(new_story):
    return typing_recorded(new_story(fixture=HardLimitEnabled))


def modified_at_story_time(story, point=None):
    """The status file is modified at a moment of the story's clock, which stands apart from the machine's."""
    seconds = (point or story.clock.timestamp().value).timestamp()
    os.utime(story.home.status_folder / f"{SESSION}.json", (seconds, seconds))


def age_context_past_compaction(story, tokens):
    """A reading the program wrote before the compaction ended, and has not rewritten since."""
    has_context(story, tokens)
    modified_at_story_time(story, story.clock.timestamp().value - STATUS_FILE_AGE)


def expect_compaction_count(story, count):
    story.expect_rows(story.typing.typed.count(COMPACT) == count, detail=str(story.typing.typed))


def ended_immediately(story):
    story.advance(STATUS_FILE_AGE)
    compacted(story, "manual")


def ended_late(story):
    story.advance(OVERLONG)
    compacted(story, "manual")


def delivered_waiting(story):
    story.advance(RETRY_DUE)


def larger_waiting_context(story):
    story.advance(WAITING_IN_THE_PROGRAM)
    has_context(story, LIMIT_TOKENS + GROWTH_TOKENS)


def started_waiting(story):
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    story.advance(OVERLONG)


@pytest.mark.parametrize("stop_interval_steps, compaction_count", [(ended_immediately, 1), (ended_late, 1), (larger_waiting_context, 1), (delivered_waiting, 2), (started_waiting, 1)],
                         ids=["b1-ended-at-once", "b5-c9-ended-after-601-seconds", "larger-context-while-the-line-waits", "sent-and-not-started-after-three-minutes-is-typed-once-more", "c9-started"])
def test_a_later_stop_types_the_compaction_a_second_time_only_after_three_minutes_with_none_started(agent, stop_interval_steps, compaction_count):
    has_context(agent, LIMIT_TOKENS)
    stops(agent)
    expect_compaction_count(agent, 1)
    stop_interval_steps(agent)
    stops(agent)
    expect_compaction_count(agent, compaction_count)


@pytest.mark.parametrize("compaction", [AutoCompacted, ManualCompacted], ids=["b2-e4-by-the-program", "b3-by-a-person"])
def test_a_stop_after_a_compaction_with_the_old_reading_types_nothing(new_story, compaction):
    agent = typing_recorded(new_story(fixture=compaction))
    age_context_past_compaction(agent, LIMIT_TOKENS)
    agent.hook(SESSION, HookSamples.prompt("check the cart"))
    agent.hook(SESSION, HookSamples.stop())
    expect_compaction_count(agent, 0)


def test_b4_a_tool_past_the_second_limit_after_the_stops_compaction_is_allowed_and_types_nothing(hard_agent):
    agent = hard_agent
    has_context(agent, HARD)
    agent.hook(SESSION, HookSamples.prompt("fix the cart"))
    agent.hook(SESSION, HookSamples.stop())
    expect_compaction_count(agent, 1)
    compacted(agent, "manual")
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    expect_compaction_count(agent, 1)


def test_b6_the_first_tool_after_the_wake_sees_the_old_number_and_is_allowed_with_nothing_typed(new_story):
    agent = typing_recorded(new_story(fixture=HardAutoCompacted))
    age_context_past_compaction(agent, HARD)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    expect_compaction_count(agent, 0)


def test_b7_the_stop_now_nudge_is_not_said_after_a_compaction_while_the_number_is_old(new_story):
    agent = typing_recorded(new_story(fixture=AutoCompacted))
    age_context_past_compaction(agent, LIMIT_TOKENS)
    reply = agent.hook(SESSION, HookSamples.sample("post_tool_use"))
    agent.expect_rows(not any("stop now" in line for line in reply.lines), detail=str(reply.lines))


def test_b8_a_memory_mark_does_not_open_at_the_old_percent_after_a_compaction(new_story):
    story = new_story(fixture=CompactedFact)
    story.report_context_percent(SESSION, 55)
    modified_at_story_time(story, story.clock.timestamp().value - STATUS_FILE_AGE)
    reply = story.hook(SESSION, EDITED)
    story.expect_rows(not any("tool uses to weigh" in line for line in reply.lines), detail=str(reply.lines))


def test_c8_a_post_tool_use_while_the_reading_is_unsettled_says_no_stop_now_and_opens_no_mark(new_story):
    story = typing_recorded(new_story(fixture=CompactedLimitedMemory))
    age_context_past_compaction(story, LIMIT_TOKENS)
    reply = story.hook(SESSION, EDITED)
    story.expect_rows(not any("stop now" in line or "tool uses to weigh" in line for line in reply.lines), detail=str(reply.lines))


def test_a_reading_the_program_rewrote_after_the_compaction_ended_counts_and_the_limit_applies_to_that_number(new_story):
    agent = typing_recorded(new_story(fixture=AutoCompacted))
    age_context_past_compaction(agent, TOKENS_OVER_LIMIT)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    expect_compaction_count(agent, 0)
    agent.advance(STATUS_FILE_AGE)
    has_context(agent, LIMIT_TOKENS - GROWTH_TOKENS)
    modified_at_story_time(agent)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    agent.advance(STATUS_FILE_AGE)
    has_context(agent, TOKENS_OVER_LIMIT)
    modified_at_story_time(agent)
    stops(agent)
    expect_compaction_count(agent, 1)


class MissingLauncherTyping(RecordedTyping):
    def send_line(self, agent_id: int, line: str) -> None:
        super().send_line(agent_id, line)
        raise Refusal(LAUNCHER_MISSING, "start the agent with journal launch")


def test_f2_a_missing_launcher_is_tried_once_and_not_again_at_every_stop(new_story):
    story = new_story(fixture=LimitEnabled)
    story.typing = MissingLauncherTyping()
    story.container.bind(TerminalTyping, story.typing)
    has_context(story, LIMIT_TOKENS)
    for _ in range(STOPS_WITHOUT_LAUNCHER):
        story.advance(OVERLONG)
        stops(story)
    story.expect_rows(len(story.typing.typed) <= 1, len(story.refusals()) <= 1, detail=f"{len(story.typing.typed)} attempts, {len(story.refusals())} refusals")
