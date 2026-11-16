from tests.stories.support.story_checks import expect_value
import pytest

from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, StrangeVariant, module_actor, expect_mark_count
from tests.stories.core.support.fixtures import UserJoined


def show(type: SampleMarkType, key: str, label: str = "A mark", ended: bool = False) -> ShowMark:
    return ShowMark(type, SampleMarkVariant.PLAIN, key, label, ended=ended)


def test_a_mark_of_a_type_no_module_declares_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="no installed module declares the mark chatsample.ghost"):
        story.run_command(show(SampleMarkType.UNKNOWN_TYPE, "ghost:1"), module_actor(story, "chatsample"), 1)
    expect_mark_count(story, 0)


def test_a_mark_written_by_another_modules_actor_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    with pytest.raises(Refusal, match="only chatsample writes a mark of chatsample.moment"):
        story.run_command(show(SampleMarkType.EVENT_TYPE, "moment:1"), module_actor(story, "journal.core.memories"), 1)
    expect_mark_count(story, 0)


def test_a_mark_written_by_its_own_modules_actor_is_shown(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run_command(show(SampleMarkType.EVENT_TYPE, "moment:1"), module_actor(story, "chatsample"), 1)
    expect_mark_count(story, 1)


def test_the_detail_is_cut_to_80_characters_and_the_lines_keep_all_of_it(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    text = "first line " + "x" * 100 + "\nsecond line"
    mark = story.run_command(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:9", "A mark", detail=text), module_actor(story, "chatsample"), 1)
    expect_value((len(mark.detail), mark.lines), (80, text))


def test_a_mark_naming_a_variant_its_type_does_not_list_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    unknown_variant = ShowMark(SampleMarkType.EVENT_TYPE, StrangeVariant.UNKNOWN, "moment:2", "A mark")
    with pytest.raises(Refusal, match="the mark chatsample.moment has no variant strange"):
        story.run_command(unknown_variant, module_actor(story, "chatsample"), 1)


def test_a_mark_for_an_agent_of_another_environment_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    with pytest.raises(Refusal, match="works in another environment"):
        story.run_command(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:3", "A mark", agent_id=story.agent.id), module_actor(story, "chatsample"), 2)

