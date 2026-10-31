from core.base.command.bus import Bus
from core.modules.chat.commands.show_mark import ShowMark
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, mark_count, module_actor
from tests.stories.core.support.fixtures import UserJoined


def test_deleting_an_environment_deletes_its_marks(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    bus, actor = story.container.get(Bus), module_actor(story, "chatsample")
    bus.run(ShowMark(1, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "In main"), actor)
    bus.run(ShowMark(2, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "In elsewhere"), actor)
    story.expect_success("environment delete 2")
    assert mark_count(story) == 1
    story.expect_text("chat-mark list --environment 1", "In main")
