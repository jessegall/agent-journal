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
    starting_count = mark_count(story)
    story.expect_success(line, actor=actor or story.agent)
    story.run_listeners()
    assert mark_count(story) == starting_count + 1 and text in marks_text(story), marks_text(story)


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
    starting_count = mark_count(story)
    story.expect_success(f'memory edit {memory_id} --text "The cart total is in euro cents"', actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == starting_count


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
    starting_count = mark_count(story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    assert mark_count(story) > starting_count and "Memories faded by one: 1 of 2 still shown" in marks_text(story), marks_text(story)


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
    starting_count = mark_count(story)
    story.expect_refusal(f"memory weigh {memory_id},{memory_id} 4,5,6", "2 memories and 3 weights", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == starting_count


def test_memory_marks_fold_in_the_declarations_words_from_three(new_story):
    story = new_story(fixture=BuilderStarted)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "memories.memory")
    assert (mark.family_title, mark.grouping, mark.group_label, mark.click) == ("Memories", "family", "{family}: {count} updates", "open row")


def test_a_memory_is_docked_with_dock_add_and_the_guards_pass(new_story):
    story = new_story(fixture=BuilderStarted)
    memory_id = story.new_row_id(FACT, actor=story.agent)
    item_id = story.new_row_id(f"dock add memories.memory memory {memory_id} --environment main", actor=story.user)
    story.expect_text(f"dock-item show {item_id}", "type: memories.memory", f"target_id: {memory_id}")
    story.expect_refusal(f"dock add memories.memory memory {memory_id} --environment main", "is docked already", actor=story.user)
    story.expect_refusal(f"dock add memories.memory task 1 --environment main", "reads no task", actor=story.user)


def test_a_reminder_removed_shows_an_acknowledged_mark_and_no_removed_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    reminder_id = story.new_row_id('memory make "Check the cart totals" --type reminder --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_success(f'memory remove {reminder_id} --reason "done"', actor=story.agent)
    story.run_listeners()
    assert f"Reminder {reminder_id} acknowledged" in marks_text(story) and f"Memory {reminder_id} removed" not in marks_text(story), marks_text(story)


def test_a_rule_given_back_shows_a_reminded_mark_of_the_reminders_family(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "Always run the tests before a commit" --type rule --keywords cart --project --environment main', actor=story.user)
    story.expect_hook_allowed("s-1", CART_EDIT, "Always run the tests before a commit")
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "memories.reminder")
    assert "Reminded the agent: Always run the tests before a commit" in marks_text(story) and mark.family == "memories.reminders", marks_text(story)
