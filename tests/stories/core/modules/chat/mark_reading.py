from core.base.database.database import Database
from core.base.registry.registry import Registry
from engine.command.bus import Bus
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, module_actor
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_events_window_with, expect_version_four_map_limit


def story_with_marks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "First mark"), actor, environment_id=1)
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:2", "Second mark", agent_id=story.agent.id), actor, environment_id=1)
    return story


def test_an_environments_marks_are_listed_newest_last(new_story):
    story = story_with_marks(new_story)
    story.expect_ordered_lines("chat-mark list --environment 1 --oldest", "First mark", "Second mark")


def test_the_marks_are_filtered_by_agent(new_story):
    story = story_with_marks(new_story)
    story.expect_text(f"chat-mark list --agent {story.agent.id}", "Second mark")
    story.expect_absent(f"chat-mark list --agent {story.agent.id}", "First mark")


def test_a_mark_is_shown_by_its_id(new_story):
    story = story_with_marks(new_story)
    story.expect_text("chat-mark show 1", "key: moment:1", "text: First mark")


def test_the_chat_window_reads_marks_and_follows_their_events(new_story):
    story = new_story(fixture=UserJoined)
    window = Registry.read(story.container.get(Database)).window("messages.chat")
    expect_version_four_map_limit("chat-mark main", "chat-mark show", set(window.reads))
    expect_events_window_with(window, "chat_mark.*")


def test_a_long_chat_is_read_one_page_at_a_time_newest_first(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    for number in range(1, 56):
        bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, f"moment:{number}", f"Mark {number}"), actor, environment_id=1)
    story.expect_text("chat-mark list --environment 1", "Mark 55", "page 1, 25 of 55 rows: --page 2 for the next")
    story.expect_text("chat-mark list --environment 1 --page 2", "Mark 30")


def test_the_main_chat_lists_only_the_marks_with_the_ids_asked_for(new_story):
    story = new_story(SAMPLE, fixture=UserJoined, environment="main")
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    for number in range(1, 4):
        bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, f"moment:{number}", f"Mark {number}"), actor, environment_id=1)
    answer = story.run("chat-mark main --ids 1,3 --json", actor=story.user)
    answer.expect_text("Mark 1")
    answer.expect_text("Mark 3")
    answer.expect_no_text("Mark 2")
