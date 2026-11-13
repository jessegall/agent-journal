from datetime import timedelta

from engine.testing.stories.story_fixture import StoryFixture

import pytest

from engine.driver.count_down import COUNTDOWN_TOOL_USES
from engine.testing.examples.hook_samples import HookSamples
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from core.modules.memories.support.memory_nudges import WEIGH_MEMORIES
from engine.testing.expectations.said_nudge import said

EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
EDIT = HookSamples.edit("src/cart.py")
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None})
SECOND = timedelta(seconds=1)
MARK_TOOL_USES = [(55, 50, 10), (85, 80, 5), (95, 90, 2)]


def fact_mark(story) -> int:
    fact_id = 1
    story.report_context_percent("s-1", 55)
    story.expect_hook_allowed("s-1", EDITED, said(WEIGH_MEMORIES))
    return fact_id


def test_passing_half_the_context_window_opens_a_mark_and_gives_the_facts_to_weigh(new_story):
    fact_mark(new_story(fixture=ContextFact))


def test_each_mark_gives_its_tool_uses_with_a_countdown_then_holds_writes_and_lets_reads_through(new_story):
    story = new_story(fixture=ContextFact)
    for percent, mark, uses in MARK_TOOL_USES:
        story.report_context_percent("s-1", percent)
        story.advance(SECOND)
        story.expect_hook_allowed("s-1", EDITED, said(WEIGH_MEMORIES))
        for remaining in reversed(range(uses)):
            story.advance(SECOND)
            story.expect_hook_allowed("s-1", EDIT, *([f"weigh memories due: {remaining} tool uses"] if remaining < COUNTDOWN_TOOL_USES else []))
        story.advance(SECOND)
        story.expect_hook_refusal("s-1", EDIT, "Weigh your memories first")
        story.expect_hook_allowed("s-1", READ)
        story.expect_success('memory skip "nothing here changed"', actor=story.agent)
        story.expect_hook_allowed("s-1", READ)


def test_a_stop_waits_for_the_weighing_from_the_moment_a_mark_opens(open_context_mark):
    story = open_context_mark
    story.expect_hook_refusal("s-1", HookSamples.stop(), "Weigh your memories first")


@pytest.mark.parametrize("weight", [6, 5], ids=["a-new-weight", "the-weight-it-has"])
def test_weighing_a_memory_closes_the_mark(context_memory, weight):
    story, fact_id = context_memory
    story.expect_text(f"memory weigh {fact_id} {weight}", f"memory {fact_id} at {weight}", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_skipping_with_a_reason_closes_the_mark(open_context_mark):
    story = open_context_mark
    story.expect_success('memory skip "nothing here changed"', actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_the_same_mark_does_not_open_twice_before_a_compaction(context_memory):
    story, fact_id = context_memory
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.report_context_percent("s-1", 60)
    story.expect_hook_silent("s-1", EDITED)


@pytest.fixture
def context_memory(new_story):
    story = new_story(fixture=ContextFact)
    fact_id = fact_mark(story)
    return story, fact_id


@pytest.fixture
def open_context_mark(new_story):
    story = new_story(fixture=ContextFact)
    fact_mark(story)
    return story


class ContextFact(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.expect_success('memory make "The cart total is in cents" --environment main', "created: memory:1", actor=story.agent)


class Limited(StoryFixture):
    parent = UserBuilder
    limit = 400_000

    def steps(self, story):
        story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
        story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {self.limit} --project", actor=story.user)


class LimitedAboveWindow(Limited):
    limit = 1_000_000


def expect_context(story, tokens: int, window_percent: int) -> None:
    save_status_file(story, "s-1", {"context_window": {"total_input_tokens": tokens, "used_percentage": window_percent}})


def expect_mark_absent(story, tokens: int, window_percent: int) -> None:
    expect_context(story, tokens, window_percent)
    story.expect_hook_silent("s-1", EDITED)


@pytest.mark.parametrize(("tokens", "window_percent", "mark"), [(200_000, 20, "Context at 50%"), (328_000, 32, "Context at 50%"), (365_000, 36, "Context at 90%")],
                         ids=["at-half-the-limit", "two-marks-too-few-tokens-apart-count-as-the-higher-one", "the-higher-of-two-close-marks-still-opens"])
def test_a_mark_counts_against_the_context_limit_when_one_is_on(new_story, tokens, window_percent, mark):
    story = new_story(fixture=Limited)
    expect_mark_absent(story, 199_000, 19)
    expect_context(story, tokens, window_percent)
    story.expect_hook_allowed("s-1", EDITED, mark)


def test_a_mark_counts_against_the_window_when_the_limit_is_off(new_story):
    story = new_story(fixture=UserBuilder)
    expect_mark_absent(story, 200_000, 20)


def test_a_mark_counts_against_the_window_when_it_is_smaller_than_the_limit(new_story):
    story = new_story(fixture=LimitedAboveWindow)
    expect_context(story, 240_000, 60)
    story.expect_hook_allowed("s-1", EDITED, "Context at 50%")
