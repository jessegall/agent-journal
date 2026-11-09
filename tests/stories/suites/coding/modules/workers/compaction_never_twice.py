import os
from datetime import timedelta

import pytest

from core.base.refusal import Refusal
from core.modules.agents.support.terminal_typing import LAUNCHER_MISSING, TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE as COMPACT
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_HARD_TOKENS
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.usage.support.status_files import keep_status_file, rewrite_status_file
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, HARD, LIMIT, PRE_COMPACT, SESSION, LimitEnabled, RecordedTyping, has_context, set_value, stops, typing_recorded

TOO_LONG = timedelta(seconds=601)
EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")


class ContextFact(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.expect_success('memory make "The cart total is in cents" --environment main', "created: memory:1", actor=story.agent)


class HardLimitEnabled(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def hard_agent(new_story):
    return typing_recorded(new_story(fixture=HardLimitEnabled))


def compacted(story, trigger):
    story.hook(SESSION, PRE_COMPACT.with_raw({"trigger": trigger}))
    story.hook(SESSION, COMPACTION_START)
    story.run_listeners()


def expect_compactions_typed(story, count):
    story.expect_rows(story.typing.typed.count(COMPACT) == count, detail=str(story.typing.typed))


def test_b1_a_stop_after_a_compaction_the_stop_typed_does_not_type_it_again(agent):
    has_context(agent, LIMIT)
    stops(agent)
    expect_compactions_typed(agent, 1)
    agent.advance(timedelta(seconds=60))
    compacted(agent, "manual")
    keep_status_file(agent, SESSION)
    stops(agent)
    expect_compactions_typed(agent, 1)


def test_b2_a_compaction_the_program_made_is_not_followed_by_a_typed_one_at_the_next_stop(agent):
    has_context(agent, LIMIT)
    compacted(agent, "auto")
    keep_status_file(agent, SESSION)
    stops(agent)
    expect_compactions_typed(agent, 0)


def test_b3_a_compaction_a_person_typed_is_not_followed_by_a_typed_one_at_the_next_stop(agent):
    has_context(agent, LIMIT)
    compacted(agent, "manual")
    keep_status_file(agent, SESSION)
    stops(agent)
    expect_compactions_typed(agent, 0)


def test_b4_a_tool_past_the_second_limit_after_the_stops_compaction_is_allowed_and_types_nothing(hard_agent):
    agent = hard_agent
    has_context(agent, HARD)
    stops(agent)
    expect_compactions_typed(agent, 1)
    compacted(agent, "manual")
    keep_status_file(agent, SESSION)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    expect_compactions_typed(agent, 1)


def test_b5_a_compaction_that_took_longer_than_the_retry_time_is_not_typed_again_when_it_ends(agent):
    has_context(agent, LIMIT)
    stops(agent)
    expect_compactions_typed(agent, 1)
    agent.advance(TOO_LONG)
    compacted(agent, "manual")
    keep_status_file(agent, SESSION)
    stops(agent)
    expect_compactions_typed(agent, 1)


def test_b6_the_first_tool_after_the_wake_sees_the_old_number_and_is_allowed_with_nothing_typed(hard_agent):
    agent = hard_agent
    has_context(agent, HARD)
    compacted(agent, "auto")
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    keep_status_file(agent, SESSION)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    expect_compactions_typed(agent, 0)


def test_b7_the_stop_now_nudge_is_not_said_after_a_compaction_while_the_number_is_old(agent):
    has_context(agent, LIMIT)
    compacted(agent, "auto")
    keep_status_file(agent, SESSION)
    reply = agent.hook(SESSION, HookSamples.sample("post_tool_use"))
    agent.expect_rows(not any("stop now" in line for line in reply.lines), detail=str(reply.lines))


def test_b8_a_memory_mark_does_not_open_at_the_old_percent_after_a_compaction(new_story):
    story = new_story(fixture=ContextFact)
    story.report_context_percent(SESSION, 55)
    compacted(story, "auto")
    keep_status_file(story, SESSION)
    reply = story.hook(SESSION, EDITED)
    story.expect_rows(not any("tool uses to weigh" in line for line in reply.lines), detail=str(reply.lines))


class LimitedMemory(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        story.expect_success('memory make "The cart total is in cents" --environment main', "created: memory:1", actor=story.agent)


def test_c8_a_post_tool_use_while_the_reading_is_unsettled_says_no_stop_now_and_opens_no_mark(new_story):
    story = typing_recorded(new_story(fixture=LimitedMemory))
    has_context(story, LIMIT)
    compacted(story, "auto")
    keep_status_file(story, SESSION)
    reply = story.hook(SESSION, EDITED)
    story.expect_rows(not any("stop now" in line or "tool uses to weigh" in line for line in reply.lines), detail=str(reply.lines))


def test_c9_a_stop_while_the_compaction_is_sent_types_nothing_more(agent):
    has_context(agent, LIMIT)
    stops(agent)
    expect_compactions_typed(agent, 1)
    agent.advance(TOO_LONG)
    stops(agent)
    expect_compactions_typed(agent, 1)


def test_c9_a_stop_while_the_compaction_is_started_types_nothing_more(agent):
    has_context(agent, LIMIT)
    stops(agent)
    agent.hook(SESSION, PRE_COMPACT.with_raw({"trigger": "manual"}))
    agent.advance(TOO_LONG)
    stops(agent)
    expect_compactions_typed(agent, 1)


def test_c9_a_stop_when_the_compaction_ended_and_the_reading_is_unsettled_types_nothing_more(agent):
    has_context(agent, LIMIT)
    stops(agent)
    compacted(agent, "manual")
    keep_status_file(agent, SESSION)
    agent.advance(TOO_LONG)
    stops(agent)
    expect_compactions_typed(agent, 1)


GROWTH_TOKENS = LIMIT // 10
SETTLED_TOKENS = LIMIT + 50_000


def modified_at_story_time(story):
    """The status file is modified now by the story's clock, which stands apart from the machine's."""
    moment = story.clock.timestamp().value.timestamp()
    os.utime(story.home.status_folder / f"{SESSION}.json", (moment, moment))


def settled_reading(story, tokens):
    story.advance(timedelta(seconds=1))
    rewrite_status_file(story, SESSION, tokens)
    modified_at_story_time(story)


def test_e4_a_reading_over_the_limit_older_than_the_end_of_the_newest_compaction_is_not_due(agent):
    has_context(agent, LIMIT + 1)
    modified_at_story_time(agent)
    agent.advance(timedelta(seconds=60))
    compacted(agent, "auto")
    keep_status_file(agent, SESSION)
    stops(agent)
    expect_compactions_typed(agent, 0)


def test_e5_after_a_compaction_left_the_context_over_the_limit_one_is_due_only_once_it_has_grown_by_a_tenth_of_the_limit(agent):
    has_context(agent, LIMIT + 1)
    modified_at_story_time(agent)
    agent.advance(timedelta(seconds=60))
    compacted(agent, "auto")
    settled_reading(agent, SETTLED_TOKENS)
    stops(agent)
    expect_compactions_typed(agent, 0)
    settled_reading(agent, SETTLED_TOKENS + GROWTH_TOKENS - 1)
    stops(agent)
    expect_compactions_typed(agent, 0)
    settled_reading(agent, SETTLED_TOKENS + GROWTH_TOKENS)
    stops(agent)
    expect_compactions_typed(agent, 1)


STOPS_WITHOUT_LAUNCHER = 5


class MissingLauncherTyping(RecordedTyping):
    def type_line(self, agent_id: int, line: str) -> None:
        super().type_line(agent_id, line)
        raise Refusal(LAUNCHER_MISSING, "start the agent with journal launch")


def test_f2_a_missing_launcher_is_tried_once_and_not_again_at_every_stop(new_story):
    story = new_story(fixture=LimitEnabled)
    story.typing = MissingLauncherTyping()
    story.container.bind(TerminalTyping, story.typing)
    has_context(story, LIMIT)
    for _ in range(STOPS_WITHOUT_LAUNCHER):
        stops(story)
        story.advance(TOO_LONG)
    story.expect_rows(len(story.typing.typed) <= 1, len(story.refusals()) <= 1, detail=f"{len(story.typing.typed)} attempts, {len(story.refusals())} refusals")


def wake_lines(story):
    return [line for line in story.typing.typed if "compacted" in line]


def test_g3_a_slow_wake_after_a_typed_compaction_is_typed_once_not_again_by_the_tick(agent):
    compacted(agent, "manual")
    agent.expect_rows(len(wake_lines(agent)) == 1, detail=str(agent.typing.typed))
    agent.advance(TOO_LONG)
    agent.tick(SESSION)
    agent.expect_rows(len(wake_lines(agent)) == 1, detail=str(agent.typing.typed))
