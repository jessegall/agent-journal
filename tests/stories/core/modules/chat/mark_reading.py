from engine.database.database import Database
from engine.registry.registry import Registry
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




