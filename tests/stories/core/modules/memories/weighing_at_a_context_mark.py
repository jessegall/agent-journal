from datetime import timedelta

from core.testing.story_fixture import StoryFixture

import pytest

from core.modules.drivers.rules.agent_block_rule import COUNTDOWN_USES
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
EDIT = HookSamples.edit("src/cart.py")
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None})
SECOND = timedelta(seconds=1)
MARK_TOOL_USES = [(55, 50, 10), (85, 80, 5), (95, 90, 2)]


def fact_mark(story) -> int:
    fact_id = 1
    story.report_context_percent("s-1", 55)
    story.expect_hook_allowed("s-1", EDITED, f"context at 50%: 10 tool uses to weigh your 1 memories, heaviest first: {fact_id}")
    return fact_id


def test_passing_half_the_context_window_opens_a_mark_and_gives_the_facts_to_weigh(new_story):
    fact_mark(new_story(fixture=ContextFact))


def test_each_mark_gives_its_tool_uses_with_a_countdown_then_holds_writes_and_lets_reads_through(new_story):
    story = new_story(fixture=ContextFact)
    for percent, mark, uses in MARK_TOOL_USES:
        story.report_context_percent("s-1", percent)
        story.advance(SECOND)
        story.expect_hook_allowed("s-1", EDITED, f"context at {mark}%: {uses} tool uses to weigh your 1 memories, heaviest first: 1")
        for remaining in reversed(range(uses)):
            story.advance(SECOND)
            story.expect_hook_allowed("s-1", EDIT, *([f"weigh memories due: {remaining} tool uses"] if remaining < COUNTDOWN_USES else []))
        story.advance(SECOND)
        story.expect_hook_refusal("s-1", EDIT, "weigh your memories first")
        story.expect_hook_allowed("s-1", READ)
        story.expect_success('memory skip "nothing here changed"', actor=story.agent)
        story.expect_hook_allowed("s-1", READ)


def test_a_stop_waits_for_the_weighing_from_the_moment_a_mark_opens(open_context_mark):
    story = open_context_mark
    story.expect_hook_refusal("s-1", HookSamples.stop(), "weigh your memories first")


def test_weighing_a_memory_closes_the_mark(context_memory):
    story, fact_id = context_memory
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_weighing_a_memory_at_the_weight_it_has_closes_the_mark(context_memory):
    story, fact_id = context_memory
    story.expect_text(f"memory weigh {fact_id} 5", f"memory {fact_id} at 5", actor=story.agent)
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


def test_a_session_whose_status_line_never_reported_opens_no_mark(new_story):
    story = new_story(fixture=ContextFact)
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
