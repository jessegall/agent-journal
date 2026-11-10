from engine.command.bus import Bus
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, mark_count, module_actor, expect_mark_count
from tests.stories.core.support.fixtures import UserJoined


def test_deleting_an_environment_deletes_its_marks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "In main"), actor, environment_id=1)
    bus.run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "In elsewhere"), actor, environment_id=2)
    story.expect_success("environment delete 2")
    expect_mark_count(story, 1)
    story.expect_text("chat-mark list --environment 1", "In main")
