from core.modules.chat.commands.show_mark.show_mark import ShowMark
from engine.command.bus import Bus
from engine.registry.registry import Registry
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, module_actor
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_events_window_with, expect_version_four_map_limit


def story_with_marks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "First mark"), actor, environment_id=1)
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:2", "Second mark", agent_id=story.agent.id), actor, environment_id=1)
    return story


def test_the_chat_window_reads_marks_and_follows_their_events(journal):
    window = Registry.read(journal.database).window("messages.chat")
    expect_version_four_map_limit("chat-mark main", "chat-mark show", set(window.reads))
    expect_events_window_with(window, "chat_mark.*")
