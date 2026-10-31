import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, StrangeVariant, mark_count, module_actor
from tests.stories.core.support.fixtures import UserJoined

MEMORY_LINE = 'memory make "Fact" --type fact --weight 3 --environment main'


def show(type: SampleMarkType, key: str, label: str = "A mark", ended: bool = False) -> ShowMark:
    return ShowMark(1, type, SampleMarkVariant.PLAIN, key, label, ended=ended)


def test_a_memory_weighed_shows_one_mark_written_by_the_listener_after_the_commit(new_story):
    story = new_story(fixture=UserJoined)
    memory_id = story.new_row_id(MEMORY_LINE, actor=story.agent)
    story.expect_success(f"memory weigh {memory_id} 7", actor=story.agent)
    assert mark_count(story) == 0
    story.run_listeners()
    assert mark_count(story) == 1
    story.expect_success("chat-mark list --environment main", f"Memory {memory_id}: weight set to 7")


def test_a_failed_command_writes_no_mark(new_story):
    story = new_story(fixture=UserJoined)
    first = story.new_row_id(MEMORY_LINE, actor=story.agent)
    story.expect_refusal(f"memory weigh {first},{first} 4,5,6", "2 memories and 3 weights", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == 0


def test_a_mark_of_a_type_no_module_declares_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="no installed module declares the mark chatsample.ghost"):
        story.container.get(Bus).run(show(SampleMarkType.GHOST, "ghost:1"), module_actor(story, "chatsample"))
    assert mark_count(story) == 0


def test_a_mark_written_by_another_modules_actor_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="only chatsample writes a mark of chatsample.moment"):
        story.container.get(Bus).run(show(SampleMarkType.MOMENT, "moment:1"), module_actor(story, "journal.core.memories"))
    assert mark_count(story) == 0


def test_a_mark_written_by_its_own_modules_actor_is_shown(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.container.get(Bus).run(show(SampleMarkType.MOMENT, "moment:1"), module_actor(story, "chatsample"))
    assert mark_count(story) == 1


def test_a_process_mark_with_the_same_key_is_edited_in_place(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Running"), actor)
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Still running"), actor)
    assert mark_count(story) == 1
    story.expect_success("chat-mark list --environment main", "Still running")


def test_a_process_mark_is_never_edited_once_it_ended(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Done", ended=True), actor)
    with pytest.raises(Refusal, match="chat mark run:1 has ended"):
        bus.run(show(SampleMarkType.PROCESS, "run:1", "Again"), actor)
    story.expect_success("chat-mark list --environment main", "Done")


def test_a_mark_shown_again_under_its_key_takes_the_new_words_and_keeps_its_id(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    first = bus.run(show(SampleMarkType.PROCESS, "run:2", "Running"), actor)
    second = bus.run(show(SampleMarkType.PROCESS, "run:2", "Passed", ended=True), actor)
    assert (second.id, second.label, second.state.value) == (first.id, "Passed", "ended")


def test_the_detail_is_cut_to_80_characters_and_the_lines_keep_all_of_it(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    text = "first line " + "x" * 100 + "\nsecond line"
    mark = story.container.get(Bus).run(ShowMark(1, SampleMarkType.MOMENT, SampleMarkVariant.PLAIN, "moment:9", "A mark", detail=text), module_actor(story, "chatsample"))
    assert (len(mark.detail), mark.lines) == (80, text)


def test_a_mark_naming_a_variant_its_type_does_not_list_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    strange = ShowMark(1, SampleMarkType.MOMENT, StrangeVariant.STRANGE, "moment:2", "A mark")
    with pytest.raises(Refusal, match="the mark chatsample.moment has no variant strange"):
        story.container.get(Bus).run(strange, module_actor(story, "chatsample"))


def test_a_listener_run_twice_for_one_event_leaves_one_mark(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    for _ in range(2):
        bus.run(ShowMark(1, SampleMarkType.MOMENT, SampleMarkVariant.PLAIN, "moment:event-7", "Event 7"), actor)
    assert mark_count(story) == 1
