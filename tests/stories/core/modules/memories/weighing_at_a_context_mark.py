from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDITED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
EDIT = HookSamples.edit("src/cart.py")
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None})


def fact_mark(story) -> int:
    fact_id = story.new_row_id('memory make "The cart total is in cents" --type fact --environment main', actor=story.agent)
    story.report_context_percent("s-1", 55)
    story.expect_hook_allowed("s-1", EDITED, "The cart total is in cents", "journal memory weigh")
    return fact_id


def test_passing_half_the_context_window_opens_a_mark_and_gives_the_facts_to_weigh(new_story):
    fact_mark(new_story(fixture=BuilderStarted))


def test_while_a_mark_is_open_a_write_is_refused_and_a_read_goes_through(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_mark(story)
    story.expect_hook_refusal("s-1", EDIT, "journal memory weigh")
    story.expect_hook_allowed("s-1", READ)


def test_weighing_a_memory_closes_the_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = fact_mark(story)
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_skipping_with_a_reason_closes_the_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_mark(story)
    story.expect_success('memory skip "nothing here changed"', actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_the_same_mark_does_not_open_twice_before_a_compaction(new_story):
    story = new_story(fixture=BuilderStarted)
    fact_id = fact_mark(story)
    story.expect_success(f"memory weigh {fact_id} 6", actor=story.agent)
    story.report_context_percent("s-1", 60)
    story.expect_hook_silent("s-1", EDITED)


def test_a_session_whose_status_line_never_reported_opens_no_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.new_row_id('memory make "The cart total is in cents" --type fact --environment main', actor=story.agent)
    story.expect_hook_silent("s-1", EDITED)
