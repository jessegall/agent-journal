from core.base.command.bus import Bus
from tests.stories.core.modules.chat.support.mark_samples import SAMPLE, SampleMarkType, SampleMarkVariant, module_actor
from core.modules.chat.commands.show_mark import ShowMark
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

CHAT = "messages.chat"


def chat_story(new_story) -> tuple[WindowStory, int]:
    story = new_story(SAMPLE, fixture=UserJoined)
    task_id = story.new_row_id('task make "Fix it" --environment main', actor=story.user)
    story.container.get(Bus).run(ShowMark(1, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "moment:1", "A mark", row_model="task", row_id=task_id),
                                 module_actor(story, "chatsample"))
    return WindowStory(story), task_id


def test_a_declared_buttons_line_runs_through_the_line_route_with_its_row(new_story):
    window_story, task_id = chat_story(new_story)
    window_story.expect_window_allowed(CHAT, f"task edit {task_id}")


def test_a_line_no_declaration_lists_is_refused(new_story):
    window_story, task_id = chat_story(new_story)
    window_story.expect_window_refusal(CHAT, f"task delete {task_id}", "messages.chat does not declare task delete")


