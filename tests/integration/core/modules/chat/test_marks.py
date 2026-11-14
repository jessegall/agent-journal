import pytest

from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, StrangeVariant, mark_count, module_actor, expect_mark_count
from tests.stories.core.support.fixtures import UserJoined



def show(type: SampleMarkType, key: str, label: str = "A mark", ended: bool = False) -> ShowMark:
    return ShowMark(type, SampleMarkVariant.PLAIN, key, label, ended=ended)








def test_a_process_mark_with_the_same_key_is_edited_in_place(played):
    story = played(UserJoined, SAMPLE)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Running"), actor, environment_id=1)
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Still running"), actor, environment_id=1)
    expect_mark_count(story, 1)
    story.expect_text("chat-mark list --environment 1", "Still running")


def test_a_process_mark_is_never_edited_once_it_ended(played):
    story = played(UserJoined, SAMPLE)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(show(SampleMarkType.PROCESS, "run:1", "Done", ended=True), actor, environment_id=1)
    with pytest.raises(Refusal, match="chat mark run:1 has ended"):
        bus.run(show(SampleMarkType.PROCESS, "run:1", "Again"), actor, environment_id=1)
    story.expect_text("chat-mark list --environment 1", "Done")


def test_a_mark_shown_again_under_its_key_takes_the_new_words_and_keeps_its_id(played):
    story = played(UserJoined, SAMPLE)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    first = bus.run(show(SampleMarkType.PROCESS, "run:2", "Running"), actor, environment_id=1)
    second = bus.run(show(SampleMarkType.PROCESS, "run:2", "Passed", ended=True), actor, environment_id=1)
    expect_id_second(second, (first.id, "Passed", "ended"))






def test_a_listener_run_twice_for_one_event_leaves_one_mark(played):
    story = played(UserJoined, SAMPLE)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    for _ in range(2):
        bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:event-7", "Event 7"), actor, environment_id=1)
    expect_mark_count(story, 1)




def expect_detail_mark_lines(mark, expected) -> None:
    actual = (len(mark.detail), mark.lines)
    assert actual == expected, actual


def expect_id_second(second, expected) -> None:
    actual = (second.id, second.text, second.state.value)
    assert actual == expected, actual
