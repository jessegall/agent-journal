from core.base.command.bus import Bus
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, module_actor
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

CHAT = "messages.chat"


def chat_story(new_story) -> tuple[WindowStory, int]:
    story = new_story(SAMPLE, fixture=UserJoined, environment="main")
    task_id = story.new_row_id('task make "Fix it"', actor=story.user)
    story.container.get(Bus).run(ShowMark(SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "A mark", row_model="task", row_id=task_id),
                                 module_actor(story, "chatsample"), environment_id=1)
    return WindowStory(story), task_id


def test_a_declared_buttons_line_runs_through_the_line_route_with_its_row(new_story):
    window_story, task_id = chat_story(new_story)
    window_story.story.expect_success("window allow button:chatsample --type runs --environment main", actor=window_story.story.user)
    window_story.expect_window_allowed(CHAT, f"task edit {task_id}")
