from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.command.bus import Bus
from core.modules.chat.commands.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, module_actor
from tests.stories.core.support.fixtures import UserJoined


def story_with_marks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(ShowMark(1, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "First mark"), actor)
    bus.run(ShowMark(1, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:2", "Second mark", agent_id=story.agent.id), actor)
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
    assert {"chat-mark list", "chat-mark show"} <= set(window.reads) and "chat_mark.*" in window.events


def test_a_long_chat_is_read_one_page_at_a_time_newest_first(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    for number in range(1, 56):
        bus.run(ShowMark(1, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, f"moment:{number}", f"Mark {number}"), actor)
    story.expect_text("chat-mark list --environment 1", "Mark 55", "page 1, 50 of 55 rows: --page 2 for the next")
    story.expect_text("chat-mark list --environment 1 --page 2", "Mark 5")
