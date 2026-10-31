from datetime import timedelta

from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import mark_count
from tests.stories.core.support.coding_fixtures import BuilderStarted

FACT = 'memory make "The cart total is in cents" --type fact --environment main'
CART_EDIT = HookSamples.edit("src/cart.py")


def marks_text(story) -> str:
    return story.run("chat-mark list --environment 1 --oldest").output_text


def shown_after_commit(story, line: str, text: str, actor=None) -> None:
    before = mark_count(story)
    story.expect_success(line, actor=actor or story.agent)
    assert mark_count(story) == before
    story.run_listeners()
    assert mark_count(story) == before + 1 and text in marks_text(story), marks_text(story)


def test_a_memory_made_shows_its_mark_after_the_commit(new_story):
    story = new_story(fixture=BuilderStarted)
    shown_after_commit(story, FACT, "Memory 1 made")


def test_a_memory_weighed_to_a_new_weight_shows_the_new_weight(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    story.run_listeners()
    shown_after_commit(story, f"memory weigh {memory_id} 8", f"Memory {memory_id}: weight set to 8")


def test_a_memory_edited_without_a_new_weight_shows_no_weighed_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    story.run_listeners()
    before = mark_count(story)
    story.expect_success(f'memory edit {memory_id} --text "The cart total is in euro cents"', actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == before


def test_a_memory_removed_shows_its_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    story.run_listeners()
    shown_after_commit(story, f'memory remove {memory_id} --reason "no longer true"', f"Memory {memory_id} removed")


def test_a_fade_shows_how_many_memories_are_still_shown(new_story):
    story = new_story(fixture=BuilderStarted)
    story.new_row_id('memory make "Almost gone" --type fact --weight 1 --environment main', actor=story.agent)
    story.new_row_id('memory make "Still strong" --type fact --weight 5 --environment main', actor=story.agent)
    story.run_listeners()
    before = mark_count(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    assert mark_count(story) > before and "Memories faded by one: 1 of 2 still shown" in marks_text(story), marks_text(story)


def test_a_memory_given_back_by_a_keyword_shows_a_reminded_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "The cart total is in cents" --type fact --keywords cart --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_hook_allowed("s-1", CART_EDIT, "The cart total is in cents")
    story.run_listeners()
    assert "Reminded the agent: The cart total is in cents" in marks_text(story), marks_text(story)


def test_a_reminder_given_when_due_shows_a_reminded_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    due = (story.clock.timestamp().value + timedelta(hours=1)).isoformat()
    story.run(f'memory make "Deploy the cart at nine" --type reminder --due {due} --environment main', actor=story.agent)
    story.advance(timedelta(hours=2))
    story.tick("s-1")
    story.expect_hook_allowed("s-1", CART_EDIT, "Deploy the cart at nine")
    story.run_listeners()
    assert "Reminded the agent: Deploy the cart at nine" in marks_text(story), marks_text(story)


def test_a_compaction_shows_a_compacted_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    assert "Conversation compacted" in marks_text(story), marks_text(story)


def test_a_failed_command_shows_no_memory_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    story.run_listeners()
    before = mark_count(story)
    story.expect_refusal(f"memory weigh {memory_id},{memory_id} 4,5,6", "2 memories and 3 weights", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == before


def test_memory_marks_fold_in_the_declarations_words_from_three(new_story):
    story = new_story(fixture=BuilderStarted)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "memories.memory")
    assert (mark.family_title, mark.grouping, mark.group_label, mark.click) == ("Memories", "family", "{family}: {count} updates", "open row")
