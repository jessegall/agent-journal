from core.testing.story_fixture import StoryFixture

import pytest

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
EDIT = HookSamples.edit("src/cart.py")
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None})


def fact_mark(story) -> int:
    fact_id = 1
    story.report_context_percent("s-1", 55)
    story.expect_hook_allowed("s-1", EDITED, f"context at 50%: weigh your 1 memories, heaviest first: {fact_id}; journal memory read <number> reads one")
    return fact_id


def test_passing_half_the_context_window_opens_a_mark_and_gives_the_facts_to_weigh(new_story):
    fact_mark(new_story(fixture=ContextFact))


def test_while_a_mark_is_open_a_write_is_refused_and_a_read_goes_through(open_context_mark):
    story = open_context_mark
    story.expect_hook_refusal("s-1", EDIT, "journal memory weigh")
    story.expect_hook_allowed("s-1", READ)


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
        story.expect_success('memory make "The cart total is in cents" --type fact --environment main', "created: memory:1", actor=story.agent)
