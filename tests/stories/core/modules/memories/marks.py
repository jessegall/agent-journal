import pytest

from datetime import timedelta

from engine.database.database import Database
from engine.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import mark_count, expect_mark_count
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text, marks_text

FACT = 'memory make "The cart total is in cents" --environment main'
CART_EDIT = HookSamples.edit("src/cart.py")


def shown_after_commit(story, line: str, text: str, actor=None) -> None:
    starting_count = mark_count(story)
    story.expect_success(line, actor=actor or story.agent)
    story.run_listeners()
    assert mark_count(story) == starting_count + 1 and text in marks_text(story), marks_text(story)


def test_a_memory_made_shows_its_mark_after_the_commit(new_story):
    story = new_story(fixture=BuilderStarted)
    shown_after_commit(story, FACT, "Memory 1 created")


def test_a_memory_weighed_to_a_new_weight_shows_the_new_weight(fact_memory):
    story, memory_id = fact_memory
    shown_after_commit(story, f"memory weigh {memory_id} 8", f"Memory {memory_id}: weight set to 8")


def test_a_memory_edited_without_a_new_weight_shows_no_weighed_mark(fact_memory):
    story, memory_id = fact_memory
    starting_count = mark_count(story)
    story.expect_success(f'memory edit {memory_id} --text "The cart total is in euro cents"', actor=story.agent)
    story.run_listeners()
    expect_mark_count(story, starting_count)


def test_a_memory_removed_shows_its_mark(fact_memory):
    story, memory_id = fact_memory
    shown_after_commit(story, f'memory remove {memory_id} --reason "no longer true"', f"Memory {memory_id} removed")


def test_a_fade_shows_how_many_memories_are_still_shown(new_story):
    story = new_story(fixture=BuilderStarted)
    story.new_row_id('memory make "Almost gone" --weight 1 --environment main', actor=story.agent)
    story.new_row_id('memory make "Still strong" --weight 5 --environment main', actor=story.agent)
    story.run_listeners()
    starting_count = mark_count(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    expect_mark_count_greater(story, starting_count)
    expect_marks_text(story, "Memories faded by one: 1 of 2 still shown")


def test_a_memory_given_back_by_a_keyword_shows_a_reminded_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "The cart total is in cents" --keywords cart --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_hook_allowed("s-1", CART_EDIT, "memory:1 applies now")
    story.run_listeners()
    expect_marks_text(story, "Reminded the agent: The cart total is in cents")


def test_a_compaction_shows_a_compacted_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    expect_marks_text(story, "Conversation compacted")


def test_a_failed_command_shows_no_memory_mark(fact_memory):
    story, memory_id = fact_memory
    starting_count = mark_count(story)
    story.expect_refusal(f"memory weigh {memory_id},{memory_id} 4,5,6", "2 memories and 3 weights", actor=story.agent)
    story.run_listeners()
    expect_mark_count(story, starting_count)


def test_memory_marks_fold_in_the_declarations_words_from_three(new_story):
    story = new_story(fixture=BuilderStarted)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "memories.memory")
    expect_row(mark, family_title="Memories", grouping="family", group_label="{family}: {count} updates", click="open row")


def test_a_memory_is_docked_with_dock_add_and_the_guards_pass(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    item_id = story.new_row_id(f"dock add memories.memory memory {memory_id} --environment main", actor=story.user)
    story.expect_text(f"dock-item show {item_id}", "type: memories.memory", f"target_id: {memory_id}")
    story.expect_refusal(f"dock add memories.memory memory {memory_id} --environment main", "is docked already", actor=story.user)
    story.expect_refusal(f"dock add memories.memory task 1 --environment main", "reads no task", actor=story.user)


def test_a_reminder_given_back_shows_a_reminded_mark_of_the_reminders_family(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "Always run the tests before a commit" --keywords cart --environment main', actor=story.user)
    story.expect_hook_allowed("s-1", CART_EDIT, "memory:1 applies now")
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "memories.reminder")
    expect_marks_text(story, "Reminded the agent: Always run the tests before a commit")
    expect_row(mark, family="memories.reminders")


@pytest.fixture
def fact_memory(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    story.run_listeners()
    return story, memory_id


def expect_mark_count_greater(story, expected) -> None:
    actual = mark_count(story)
    assert actual > expected, actual
