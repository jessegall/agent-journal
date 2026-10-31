from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

PAST_HALF = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use", raw={"context_percent": 55})
STILL_PAST_HALF = PAST_HALF.with_fields(raw={"context_percent": 60})
EDIT = HookSamples.edit("src/cart.py")
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "kind": "read", "files": ["src/cart.py"], "diff": None})


def marked(story) -> int:
    fact_id = story.new_row_id('memory make "The cart total is in cents" --type fact --environment main', actor=story.agent)
    story.expect_hook_allowed("s-1", PAST_HALF, "The cart total is in cents", "journal memory weigh")
    return fact_id


def test_passing_half_the_context_window_opens_a_mark_and_gives_the_facts_to_weigh(new_story):
    marked(new_story(fixture=BuilderStarted))


def test_while_a_mark_is_open_a_write_is_refused_and_a_read_goes_through(new_story):
    story = new_story(fixture=BuilderStarted)
    marked(story)
    story.expect_hook_refusal("s-1", EDIT, "journal memory weigh")
    story.expect_hook_allowed("s-1", READ)


def test_weighing_a_memory_closes_the_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = marked(story)
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_skipping_with_a_reason_closes_the_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    marked(story)
    story.expect_success('memory skip "nothing here changed"', actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_the_same_mark_does_not_open_twice_before_a_compaction(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = marked(story)
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.expect_hook_silent("s-1", STILL_PAST_HALF)
